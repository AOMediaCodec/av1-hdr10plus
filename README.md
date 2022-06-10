# AV1 and HDR10+

This is the official AOM repository for the development of the specification for the use of AV1 and HDR10+.

## Conformance

A set of files used to verify the conformance to the specification can be found in [conformance](./conformance) directory. This directory includes both, valid and invalid files. The validation tool [ComplianceWarden AOM AV1 HDR10+](https://gpac.github.io/ComplianceWarden-wasm/av1hdr10plus.html) can be used to validate conformance of your files to this specification.

## Specification development
This specification is written using [Bikeshed](https://tabatkins.github.io/bikeshed/).

The main file is called `index.bs` and is used by the Bikeshed tool to generate `index.html`, which is then published via [GitHub Pages](https://pages.github.com).

If you have modifications to make (e.g. in pull requests), change the `index.bs` file. Then, run Bikeshed to produce the HTML file and verify your changes.

Bikeshed can be run locally on your machine after installation:

```shell
bikeshed spec
```

Or executed remotely e.g.:

```shell
curl https://api.csswg.org/bikeshed/ -F file=@index.bs -F force=1 > index.html
```

See the [Bikeshed Documentation](https://tabatkins.github.io/bikeshed/) for more details.
