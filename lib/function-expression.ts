import type { FunctionGraphPoint } from "@/types/function-playground"

const supportedFunctions = {
  abs: Math.abs,
  cos: Math.cos,
  exp: Math.exp,
  log: Math.log,
  sin: Math.sin,
  sqrt: Math.sqrt,
  tan: Math.tan,
}

type SupportedFunctionName = keyof typeof supportedFunctions

function compileExpression(expression: string) {
  const normalizedExpression = expression.replace(/\^/g, "**")

  // Controlled evaluation for math expressions entered in the playground.
  const evaluator = Function(
    "x",
    ...Object.keys(supportedFunctions),
    `return ${normalizedExpression};`
  ) as (
    x: number,
    ...functions: Array<(value: number) => number>
  ) => number

  return (x: number) =>
    evaluator(
      x,
      ...Object.keys(supportedFunctions).map(
        (name) => supportedFunctions[name as SupportedFunctionName]
      )
    )
}

export function generateFunctionPoints(
  expression: string,
  xMin: number,
  xMax: number,
  points: number
): FunctionGraphPoint[] {
  if (!expression.trim()) {
    throw new Error("Enter a mathematical function.")
  }

  if (xMax <= xMin) {
    throw new Error("X max must be greater than X min.")
  }

  if (points < 2) {
    throw new Error("Points must be at least 2.")
  }

  const evaluate = compileExpression(expression)
  const step = (xMax - xMin) / (points - 1)

  return Array.from({ length: points }, (_, index) => {
    const x = xMin + step * index
    const y = evaluate(x)

    if (!Number.isFinite(y)) {
      throw new Error("The function produced an invalid value in the selected range.")
    }

    return { x, y }
  })
}
