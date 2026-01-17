"""
Data Quality Verification and Exploratory Analysis
For cleaned UIDAI Aadhaar datasets
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json


def load_cleaned_data():
    """Load all cleaned datasets"""
    print("Loading cleaned datasets...")
    
    enrol_df = pd.read_csv('data_clean/enrolment_clean.csv', parse_dates=['date'])
    demo_df = pd.read_csv('data_clean/demographic_clean.csv', parse_dates=['date'])
    bio_df = pd.read_csv('data_clean/biometric_clean.csv', parse_dates=['date'])
    
    print(f"✓ Enrollment: {len(enrol_df):,} rows")
    print(f"✓ Demographic: {len(demo_df):,} rows")
    print(f"✓ Biometric: {len(bio_df):,} rows")
    
    return enrol_df, demo_df, bio_df


def verify_data_quality(df, name):
    """Verify data quality metrics"""
    print(f"\n{'='*70}")
    print(f"DATA QUALITY CHECK: {name.upper()}")
    print('='*70)
    
    # Check for nulls
    null_counts = df.isnull().sum()
    if null_counts.sum() > 0:
        print(f"⚠ Warning: Found null values:")
        print(null_counts[null_counts > 0])
    else:
        print("✓ No null values found")
    
    # Check for duplicates
    duplicates = df.duplicated().sum()
    if duplicates > 0:
        print(f"⚠ Warning: Found {duplicates} duplicate rows")
    else:
        print("✓ No duplicate rows")
    
    # Check date range
    print(f"\n✓ Date range: {df['date'].min().date()} to {df['date'].max().date()}")
    
    # Check for anomalies in numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    print(f"\n✓ Numeric columns statistics:")
    for col in numeric_cols:
        if col not in ['year', 'month']:
            negative = (df[col] < 0).sum()
            if negative > 0:
                print(f"  ⚠ {col}: {negative} negative values")
            else:
                print(f"  ✓ {col}: min={df[col].min()}, max={df[col].max():,}, mean={df[col].mean():.2f}")
    
    # Check categorical columns
    print(f"\n✓ Unique values in categorical columns:")
    print(f"  States: {df['state'].nunique()}")
    print(f"  Districts: {df['district'].nunique()}")
    print(f"  Pincodes: {df['pincode'].nunique()}")
    
    # Top states
    print(f"\n✓ Top 10 states by record count:")
    top_states = df['state'].value_counts().head(10)
    for state, count in top_states.items():
        print(f"  {state}: {count:,}")


def generate_insights(enrol_df, demo_df, bio_df):
    """Generate preliminary insights"""
    print(f"\n{'='*70}")
    print("PRELIMINARY INSIGHTS")
    print('='*70)
    
    # Temporal patterns
    print("\n1. TEMPORAL PATTERNS")
    print(f"   Enrollment period: {enrol_df['date'].min().date()} to {enrol_df['date'].max().date()}")
    print(f"   Most active enrollment month: {enrol_df.groupby('month')['total_enrollments'].sum().idxmax()}")
    print(f"   Most active enrollment day: {enrol_df['day_of_week'].value_counts().idxmax()}")
    
    # Geographic patterns
    print("\n2. GEOGRAPHIC PATTERNS")
    top_enrol_states = enrol_df.groupby('state')['total_enrollments'].sum().sort_values(ascending=False).head(5)
    print("   Top 5 states by enrollments:")
    for state, count in top_enrol_states.items():
        print(f"   - {state}: {count:,}")
    
    # Age distribution
    print("\n3. AGE DISTRIBUTION IN ENROLLMENTS")
    total_0_5 = enrol_df['age_0_5'].sum()
    total_5_17 = enrol_df['age_5_17'].sum()
    total_18_plus = enrol_df['age_18_greater'].sum()
    total_all = total_0_5 + total_5_17 + total_18_plus
    
    print(f"   Age 0-5: {total_0_5:,} ({total_0_5/total_all*100:.1f}%)")
    print(f"   Age 5-17: {total_5_17:,} ({total_5_17/total_all*100:.1f}%)")
    print(f"   Age 18+: {total_18_plus:,} ({total_18_plus/total_all*100:.1f}%)")
    
    # Update patterns
    print("\n4. UPDATE PATTERNS")
    print(f"   Total demographic updates: {demo_df['total_demographic_updates'].sum():,}")
    print(f"   Total biometric updates: {bio_df['total_biometric_updates'].sum():,}")
    print(f"   Average demographic updates per day: {demo_df.groupby('date')['total_demographic_updates'].sum().mean():.0f}")
    print(f"   Average biometric updates per day: {bio_df.groupby('date')['total_biometric_updates'].sum().mean():.0f}")
    
    # District coverage
    print("\n5. COVERAGE")
    all_districts = set(enrol_df['district'].unique()) | set(demo_df['district'].unique()) | set(bio_df['district'].unique())
    all_pincodes = set(enrol_df['pincode'].unique()) | set(demo_df['pincode'].unique()) | set(bio_df['pincode'].unique())
    print(f"   Total districts covered: {len(all_districts)}")
    print(f"   Total pincodes covered: {len(all_pincodes)}")


def generate_data_profile():
    """Generate comprehensive data profile"""
    print(f"\n{'='*70}")
    print("GENERATING DATA PROFILE")
    print('='*70)
    
    enrol_df, demo_df, bio_df = load_cleaned_data()
    
    # Verify each dataset
    verify_data_quality(enrol_df, "Enrollment")
    verify_data_quality(demo_df, "Demographic")
    verify_data_quality(bio_df, "Biometric")
    
    # Generate insights
    generate_insights(enrol_df, demo_df, bio_df)
    
    # Save data profile
    profile = {
        'enrollment': {
            'shape': enrol_df.shape,
            'columns': list(enrol_df.columns),
            'dtypes': {col: str(dtype) for col, dtype in enrol_df.dtypes.items()},
            'date_range': [str(enrol_df['date'].min()), str(enrol_df['date'].max())],
            'memory_usage_mb': enrol_df.memory_usage(deep=True).sum() / 1024**2
        },
        'demographic': {
            'shape': demo_df.shape,
            'columns': list(demo_df.columns),
            'dtypes': {col: str(dtype) for col, dtype in demo_df.dtypes.items()},
            'date_range': [str(demo_df['date'].min()), str(demo_df['date'].max())],
            'memory_usage_mb': demo_df.memory_usage(deep=True).sum() / 1024**2
        },
        'biometric': {
            'shape': bio_df.shape,
            'columns': list(bio_df.columns),
            'dtypes': {col: str(dtype) for col, dtype in bio_df.dtypes.items()},
            'date_range': [str(bio_df['date'].min()), str(bio_df['date'].max())],
            'memory_usage_mb': bio_df.memory_usage(deep=True).sum() / 1024**2
        }
    }
    
    with open('outputs/data_profile.json', 'w') as f:
        json.dump(profile, f, indent=2, default=str)
    
    print(f"\n✓ Data profile saved to: outputs/data_profile.json")
    
    print(f"\n{'='*70}")
    print("✓ DATA QUALITY CHECK COMPLETED")
    print('='*70)


if __name__ == '__main__':
    generate_data_profile()
