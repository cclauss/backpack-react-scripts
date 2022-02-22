Our react scripts fork includes a number of custom configuration items in order to support building web products at Skyscanner. The table below will describe what each of the configs do

| Feature | Description | Default Value |
|:---|:--|:---|
| **ignoreCssWarnings** | Provides the ablity to supress CSS ordering warnings when its safe and ordering is not of a concern on the output <br> See [mini css extract plugin docs](https://github.com/webpack-contrib/mini-css-extract-plugin#remove-order-warnings) | **false** - by default we should care about order as it can sometimes have an output impact |
