## markstahl.org
The responsitory for markstahl.org. Ideas and their associated research are issues. Work in progress posts are on their own feature branch.

### Installation

```shell
$ git clone git@github.com:mjstahl/markstahl.org.git
$ cd markstahl.org
$ npm install
```

### Content

Each post shall added to the 'content' directory with the following naming convention:

`YY-MM-DD-hyphen-separated-title.md`

Any metadata content shall be placed at the top of the file and separated with three hyphens at the top and bottom ([YAML section markers](https://yaml.org/spec/1.2/spec.html#id2760395)).

After adding a new post, run `npm run build` to generate the HTML output.
