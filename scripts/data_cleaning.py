"""
Comprehensive Data Cleaning Script for UIDAI Aadhaar Dataset
Handles enrollment, demographic, and biometric data
"""

import pandas as pd
import numpy as np
import os
import json
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')


class AadhaarDataCleaner:
    """Clean and validate Aadhaar enrollment, demographic, and biometric data"""
    
    def __init__(self, data_dir, output_dir):
        self.data_dir = Path(data_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.cleaning_report = {
            'timestamp': datetime.now().isoformat(),
            'datasets': {},
            'summary': {}
        }
        
        # Valid states in India
        self.valid_states = {
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
            'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
            'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
            'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
            'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
            'Puducherry'
        }
    
    def clean_enrolment_data(self):
        """Clean enrollment data files"""
        print("\n" + "="*80)
        print("CLEANING ENROLLMENT DATA")
        print("="*80)
        
        enrolment_dir = self.data_dir / 'api_data_aadhar_enrolment'
        files = sorted(enrolment_dir.glob('*.csv'))
        
        all_data = []
        stats = {
            'total_rows': 0,
            'rows_cleaned': 0,
            'duplicates_removed': 0,
            'invalid_dates': 0,
            'invalid_states': 0,
            'invalid_pincodes': 0,
            'negative_values': 0,
            'missing_values': 0
        }
        
        for file in files:
            print(f"\nProcessing: {file.name}")
            df = pd.read_csv(file)
            stats['total_rows'] += len(df)
            
            # Store original count
            original_count = len(df)
            
            # 1. Convert date column
            df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
            invalid_dates = df['date'].isna().sum()
            stats['invalid_dates'] += invalid_dates
            df = df.dropna(subset=['date'])
            
            # 2. Clean state names
            df['state'] = df['state'].str.strip()
            invalid_states = ~df['state'].isin(self.valid_states)
            stats['invalid_states'] += invalid_states.sum()
            df = df[df['state'].isin(self.valid_states)]
            
            # 3. Validate pincode (should be 6 digits)
            df['pincode'] = df['pincode'].astype(str).str.strip()
            valid_pincode = df['pincode'].str.match(r'^\d{6}$')
            stats['invalid_pincodes'] += (~valid_pincode).sum()
            df = df[valid_pincode]
            
            # 4. Clean district names
            df['district'] = df['district'].str.strip().str.title()
            
            # 5. Check for negative values in age columns
            age_cols = ['age_0_5', 'age_5_17', 'age_18_greater']
            for col in age_cols:
                negative_mask = df[col] < 0
                stats['negative_values'] += negative_mask.sum()
                df = df[~negative_mask]
            
            # 6. Check for missing values
            missing = df.isnull().sum().sum()
            stats['missing_values'] += missing
            df = df.dropna()
            
            all_data.append(df)
            print(f"  Original rows: {original_count:,}")
            print(f"  After cleaning: {len(df):,}")
            print(f"  Removed: {original_count - len(df):,}")
        
        # Combine all data
        combined_df = pd.concat(all_data, ignore_index=True)
        
        # Remove duplicates
        duplicates = combined_df.duplicated().sum()
        stats['duplicates_removed'] = duplicates
        combined_df = combined_df.drop_duplicates()
        
        # Add derived columns
        combined_df['total_enrollments'] = (
            combined_df['age_0_5'] + 
            combined_df['age_5_17'] + 
            combined_df['age_18_greater']
        )
        combined_df['year'] = combined_df['date'].dt.year
        combined_df['month'] = combined_df['date'].dt.month
        combined_df['day_of_week'] = combined_df['date'].dt.day_name()
        
        # Sort by date
        combined_df = combined_df.sort_values('date').reset_index(drop=True)
        
        stats['rows_cleaned'] = len(combined_df)
        
        # Save cleaned data
        output_file = self.output_dir / 'enrolment_clean.csv'
        combined_df.to_csv(output_file, index=False)
        print(f"\n✓ Saved cleaned enrollment data: {output_file}")
        print(f"  Final rows: {len(combined_df):,}")
        
        self.cleaning_report['datasets']['enrolment'] = stats
        return combined_df
    
    def clean_demographic_data(self):
        """Clean demographic update data files"""
        print("\n" + "="*80)
        print("CLEANING DEMOGRAPHIC DATA")
        print("="*80)
        
        demographic_dir = self.data_dir / 'api_data_aadhar_demographic'
        files = sorted(demographic_dir.glob('*.csv'))
        
        all_data = []
        stats = {
            'total_rows': 0,
            'rows_cleaned': 0,
            'duplicates_removed': 0,
            'invalid_dates': 0,
            'invalid_states': 0,
            'invalid_pincodes': 0,
            'negative_values': 0,
            'missing_values': 0
        }
        
        for file in files:
            print(f"\nProcessing: {file.name}")
            df = pd.read_csv(file)
            stats['total_rows'] += len(df)
            
            original_count = len(df)
            
            # 1. Convert date
            df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
            invalid_dates = df['date'].isna().sum()
            stats['invalid_dates'] += invalid_dates
            df = df.dropna(subset=['date'])
            
            # 2. Clean state names
            df['state'] = df['state'].str.strip()
            invalid_states = ~df['state'].isin(self.valid_states)
            stats['invalid_states'] += invalid_states.sum()
            df = df[df['state'].isin(self.valid_states)]
            
            # 3. Validate pincode
            df['pincode'] = df['pincode'].astype(str).str.strip()
            valid_pincode = df['pincode'].str.match(r'^\d{6}$')
            stats['invalid_pincodes'] += (~valid_pincode).sum()
            df = df[valid_pincode]
            
            # 4. Clean district names
            df['district'] = df['district'].str.strip().str.title()
            
            # 5. Check for negative values
            age_cols = ['demo_age_5_17', 'demo_age_17_']
            for col in age_cols:
                if col in df.columns:
                    negative_mask = df[col] < 0
                    stats['negative_values'] += negative_mask.sum()
                    df = df[~negative_mask]
            
            # 6. Check for missing values
            missing = df.isnull().sum().sum()
            stats['missing_values'] += missing
            df = df.dropna()
            
            all_data.append(df)
            print(f"  Original rows: {original_count:,}")
            print(f"  After cleaning: {len(df):,}")
            print(f"  Removed: {original_count - len(df):,}")
        
        # Combine all data
        combined_df = pd.concat(all_data, ignore_index=True)
        
        # Remove duplicates
        duplicates = combined_df.duplicated().sum()
        stats['duplicates_removed'] = duplicates
        combined_df = combined_df.drop_duplicates()
        
        # Add derived columns
        combined_df['total_demographic_updates'] = (
            combined_df['demo_age_5_17'] + 
            combined_df['demo_age_17_']
        )
        combined_df['year'] = combined_df['date'].dt.year
        combined_df['month'] = combined_df['date'].dt.month
        combined_df['day_of_week'] = combined_df['date'].dt.day_name()
        
        # Sort by date
        combined_df = combined_df.sort_values('date').reset_index(drop=True)
        
        stats['rows_cleaned'] = len(combined_df)
        
        # Save cleaned data
        output_file = self.output_dir / 'demographic_clean.csv'
        combined_df.to_csv(output_file, index=False)
        print(f"\n✓ Saved cleaned demographic data: {output_file}")
        print(f"  Final rows: {len(combined_df):,}")
        
        self.cleaning_report['datasets']['demographic'] = stats
        return combined_df
    
    def clean_biometric_data(self):
        """Clean biometric update data files"""
        print("\n" + "="*80)
        print("CLEANING BIOMETRIC DATA")
        print("="*80)
        
        biometric_dir = self.data_dir / 'api_data_aadhar_biometric'
        files = sorted(biometric_dir.glob('*.csv'))
        
        all_data = []
        stats = {
            'total_rows': 0,
            'rows_cleaned': 0,
            'duplicates_removed': 0,
            'invalid_dates': 0,
            'invalid_states': 0,
            'invalid_pincodes': 0,
            'negative_values': 0,
            'missing_values': 0
        }
        
        for file in files:
            print(f"\nProcessing: {file.name}")
            df = pd.read_csv(file)
            stats['total_rows'] += len(df)
            
            original_count = len(df)
            
            # 1. Convert date
            df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
            invalid_dates = df['date'].isna().sum()
            stats['invalid_dates'] += invalid_dates
            df = df.dropna(subset=['date'])
            
            # 2. Clean state names
            df['state'] = df['state'].str.strip()
            invalid_states = ~df['state'].isin(self.valid_states)
            stats['invalid_states'] += invalid_states.sum()
            df = df[df['state'].isin(self.valid_states)]
            
            # 3. Validate pincode
            df['pincode'] = df['pincode'].astype(str).str.strip()
            valid_pincode = df['pincode'].str.match(r'^\d{6}$')
            stats['invalid_pincodes'] += (~valid_pincode).sum()
            df = df[valid_pincode]
            
            # 4. Clean district names
            df['district'] = df['district'].str.strip().str.title()
            
            # 5. Check for negative values
            age_cols = ['bio_age_5_17', 'bio_age_17_']
            for col in age_cols:
                if col in df.columns:
                    negative_mask = df[col] < 0
                    stats['negative_values'] += negative_mask.sum()
                    df = df[~negative_mask]
            
            # 6. Check for missing values
            missing = df.isnull().sum().sum()
            stats['missing_values'] += missing
            df = df.dropna()
            
            all_data.append(df)
            print(f"  Original rows: {original_count:,}")
            print(f"  After cleaning: {len(df):,}")
            print(f"  Removed: {original_count - len(df):,}")
        
        # Combine all data
        combined_df = pd.concat(all_data, ignore_index=True)
        
        # Remove duplicates
        duplicates = combined_df.duplicated().sum()
        stats['duplicates_removed'] = duplicates
        combined_df = combined_df.drop_duplicates()
        
        # Add derived columns
        combined_df['total_biometric_updates'] = (
            combined_df['bio_age_5_17'] + 
            combined_df['bio_age_17_']
        )
        combined_df['year'] = combined_df['date'].dt.year
        combined_df['month'] = combined_df['date'].dt.month
        combined_df['day_of_week'] = combined_df['date'].dt.day_name()
        
        # Sort by date
        combined_df = combined_df.sort_values('date').reset_index(drop=True)
        
        stats['rows_cleaned'] = len(combined_df)
        
        # Save cleaned data
        output_file = self.output_dir / 'biometric_clean.csv'
        combined_df.to_csv(output_file, index=False)
        print(f"\n✓ Saved cleaned biometric data: {output_file}")
        print(f"  Final rows: {len(combined_df):,}")
        
        self.cleaning_report['datasets']['biometric'] = stats
        return combined_df
    
    def generate_summary_stats(self, enrol_df, demo_df, bio_df):
        """Generate summary statistics"""
        print("\n" + "="*80)
        print("GENERATING SUMMARY STATISTICS")
        print("="*80)
        
        summary = {
            'total_records_cleaned': {
                'enrollment': len(enrol_df),
                'demographic': len(demo_df),
                'biometric': len(bio_df)
            },
            'date_range': {
                'enrollment': {
                    'start': enrol_df['date'].min().strftime('%Y-%m-%d'),
                    'end': enrol_df['date'].max().strftime('%Y-%m-%d')
                },
                'demographic': {
                    'start': demo_df['date'].min().strftime('%Y-%m-%d'),
                    'end': demo_df['date'].max().strftime('%Y-%m-%d')
                },
                'biometric': {
                    'start': bio_df['date'].min().strftime('%Y-%m-%d'),
                    'end': bio_df['date'].max().strftime('%Y-%m-%d')
                }
            },
            'unique_locations': {
                'states': len(set(enrol_df['state'].unique()) | 
                             set(demo_df['state'].unique()) | 
                             set(bio_df['state'].unique())),
                'districts': len(set(enrol_df['district'].unique()) | 
                               set(demo_df['district'].unique()) | 
                               set(bio_df['district'].unique())),
                'pincodes': len(set(enrol_df['pincode'].unique()) | 
                              set(demo_df['pincode'].unique()) | 
                              set(bio_df['pincode'].unique()))
            },
            'total_enrollments': int(enrol_df['total_enrollments'].sum()),
            'total_demographic_updates': int(demo_df['total_demographic_updates'].sum()),
            'total_biometric_updates': int(bio_df['total_biometric_updates'].sum())
        }
        
        self.cleaning_report['summary'] = summary
        
        print(f"\n✓ Summary Statistics Generated")
        print(f"  Total enrollment records: {summary['total_records_cleaned']['enrollment']:,}")
        print(f"  Total demographic records: {summary['total_records_cleaned']['demographic']:,}")
        print(f"  Total biometric records: {summary['total_records_cleaned']['biometric']:,}")
        print(f"  Unique states: {summary['unique_locations']['states']}")
        print(f"  Unique districts: {summary['unique_locations']['districts']}")
        print(f"  Unique pincodes: {summary['unique_locations']['pincodes']}")
    
    def save_report(self):
        """Save cleaning report"""
        # Save JSON report
        json_file = Path('outputs') / 'data_cleaning_report.json'
        
        # Convert numpy types to native Python types for JSON serialization
        def convert_to_native(obj):
            if isinstance(obj, dict):
                return {k: convert_to_native(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_native(item) for item in obj]
            elif hasattr(obj, 'item'):  # numpy types
                return obj.item()
            elif isinstance(obj, (np.integer, np.floating)):
                return obj.item()
            return obj
        
        cleaned_report = convert_to_native(self.cleaning_report)
        
        with open(json_file, 'w') as f:
            json.dump(cleaned_report, f, indent=2)
        
        # Save Markdown report
        md_file = Path('outputs') / 'data_cleaning_report.md'
        with open(md_file, 'w') as f:
            f.write("# UIDAI Aadhaar Data Cleaning Report\n\n")
            f.write(f"**Generated:** {self.cleaning_report['timestamp']}\n\n")
            
            f.write("## Summary\n\n")
            summary = self.cleaning_report['summary']
            f.write(f"- **Total Enrollment Records:** {summary['total_records_cleaned']['enrollment']:,}\n")
            f.write(f"- **Total Demographic Records:** {summary['total_records_cleaned']['demographic']:,}\n")
            f.write(f"- **Total Biometric Records:** {summary['total_records_cleaned']['biometric']:,}\n")
            f.write(f"- **Unique States:** {summary['unique_locations']['states']}\n")
            f.write(f"- **Unique Districts:** {summary['unique_locations']['districts']}\n")
            f.write(f"- **Unique Pincodes:** {summary['unique_locations']['pincodes']}\n\n")
            
            f.write("## Cleaning Statistics by Dataset\n\n")
            
            for dataset_name, stats in self.cleaning_report['datasets'].items():
                f.write(f"### {dataset_name.title()} Data\n\n")
                f.write(f"- Total rows processed: {stats['total_rows']:,}\n")
                f.write(f"- Rows after cleaning: {stats['rows_cleaned']:,}\n")
                f.write(f"- Duplicates removed: {stats['duplicates_removed']:,}\n")
                f.write(f"- Invalid dates: {stats['invalid_dates']:,}\n")
                f.write(f"- Invalid states: {stats['invalid_states']:,}\n")
                f.write(f"- Invalid pincodes: {stats['invalid_pincodes']:,}\n")
                f.write(f"- Negative values: {stats['negative_values']:,}\n")
                f.write(f"- Missing values: {stats['missing_values']:,}\n")
                f.write(f"- **Data quality: {(stats['rows_cleaned']/stats['total_rows']*100):.2f}%**\n\n")
            
            f.write("## Data Files Generated\n\n")
            f.write("- `data_clean/enrolment_clean.csv`\n")
            f.write("- `data_clean/demographic_clean.csv`\n")
            f.write("- `data_clean/biometric_clean.csv`\n\n")
            
            f.write("## Cleaning Steps Applied\n\n")
            f.write("1. ✓ Date validation and conversion\n")
            f.write("2. ✓ State name standardization\n")
            f.write("3. ✓ Pincode validation (6-digit format)\n")
            f.write("4. ✓ District name standardization\n")
            f.write("5. ✓ Negative value removal\n")
            f.write("6. ✓ Missing value handling\n")
            f.write("7. ✓ Duplicate record removal\n")
            f.write("8. ✓ Derived columns added (year, month, day_of_week, totals)\n")
        
        print(f"\n✓ Reports saved:")
        print(f"  - {json_file}")
        print(f"  - {md_file}")
    
    def run(self):
        """Run complete data cleaning pipeline"""
        print("\n" + "="*80)
        print("UIDAI AADHAAR DATA CLEANING PIPELINE")
        print("="*80)
        print(f"Input directory: {self.data_dir}")
        print(f"Output directory: {self.output_dir}")
        
        # Clean each dataset
        enrol_df = self.clean_enrolment_data()
        demo_df = self.clean_demographic_data()
        bio_df = self.clean_biometric_data()
        
        # Generate summary
        self.generate_summary_stats(enrol_df, demo_df, bio_df)
        
        # Save report
        self.save_report()
        
        print("\n" + "="*80)
        print("✓ DATA CLEANING COMPLETED SUCCESSFULLY")
        print("="*80)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Clean UIDAI Aadhaar datasets')
    parser.add_argument('--data-dir', default='data', help='Input data directory')
    parser.add_argument('--output-dir', default='data_clean', help='Output directory for cleaned data')
    
    args = parser.parse_args()
    
    cleaner = AadhaarDataCleaner(args.data_dir, args.output_dir)
    cleaner.run()
