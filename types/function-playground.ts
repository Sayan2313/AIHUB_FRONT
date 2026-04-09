export interface FunctionGraphPoint {
  x: number
  y: number
}

export type ActivationFunction = "relu" | "tanh" | "sigmoid" | "linear"

export interface FunctionApproximationRequest {
  expression: string
  xMin: number
  xMax: number
  points: number
  neuronsPerLayer: number[]
  epochs: number
  seed: number
  learningRate: number
  activation: ActivationFunction
}

export interface PredictedSeriesPayload {
  x: number[]
  y: number[]
  Avg_Train_loss?: number
  avgTrainLoss?: number
  trainTimeMs?: number
  trainingTimeMs?: number
}

export interface FunctionApproximationResponse {
  predicted: PredictedSeriesPayload
}
