// API service for fetching data from FastAPI backend
const API_BASE_URL = "http://localhost:8000";

export interface Metrics {
  total_enrollments: number;
  total_enrollments_formatted: string;
  total_demographic_updates: number;
  total_demographic_updates_formatted: string;
  total_biometric_updates: number;
  total_biometric_updates_formatted: string;
  biometric_success_rate: number;
  data_quality_score: number;
  records_count: {
    enrollment: number;
    demographic: number;
    biometric: number;
  };
}

export interface TrendsData {
  dates: string[];
  enrollment: number[];
  demographic: number[];
  biometric: number[];
  period: string;
}

export interface StateData {
  state: string;
  enrollments: number;
  enrollments_formatted: string;
  districts: number;
  pincodes: number;
  code?: string;
}

export interface StatesResponse {
  top_states: StateData[];
  total_states: number;
}

export interface AllStatesResponse {
  states: StateData[];
  total_states: number;
  total_enrollments: number;
}

export interface AgeGroup {
  group: string;
  count: number;
  percentage: number;
}

export interface DemographicsResponse {
  age_distribution: AgeGroup[];
  total: number;
}

export interface Anomaly {
  type: string;
  severity: string;
  message: string;
  detail: string;
}

export interface AnomaliesResponse {
  anomalies: Anomaly[];
  count: number;
  last_checked: string;
}

export interface Insight {
  title: string;
  detail: string;
  action: string;
}

export interface InsightsResponse {
  insights: Insight[];
  generated_at: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getMetrics(): Promise<Metrics> {
    return this.fetchData<Metrics>("/metrics");
  }

  async getTrends(days: number = 30): Promise<TrendsData> {
    return this.fetchData<TrendsData>(`/trends?days=${days}`);
  }

  async getStates(topN: number = 10): Promise<StatesResponse> {
    return this.fetchData<StatesResponse>(`/states?top_n=${topN}`);
  }

  async getAllStates(): Promise<AllStatesResponse> {
    return this.fetchData<AllStatesResponse>("/states/all");
  }

  async getDemographics(): Promise<DemographicsResponse> {
    return this.fetchData<DemographicsResponse>("/demographics");
  }

  async getAnomalies(): Promise<AnomaliesResponse> {
    return this.fetchData<AnomaliesResponse>("/anomalies");
  }

  async getInsights(): Promise<InsightsResponse> {
    return this.fetchData<InsightsResponse>("/insights");
  }

  async checkHealth(): Promise<{ status: string; message: string }> {
    return this.fetchData<{ status: string; message: string }>("/");
  }
}

export const apiService = new APIService();
