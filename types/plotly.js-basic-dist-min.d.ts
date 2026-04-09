declare module "plotly.js-basic-dist-min" {
  const Plotly: {
    newPlot: (
      root: HTMLDivElement,
      data: unknown[],
      layout: unknown,
      config: unknown
    ) => Promise<void>
    purge: (root: HTMLDivElement) => void
  }

  export default Plotly
}
