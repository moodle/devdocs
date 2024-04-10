#!/bin/bash

version="$1"

position=`echo $version | sed 's/\..*$//'`
subposition=$( echo $version | sed 's/^.*\.//' )
prefix=""
if [[ $subposition -lt 10 ]]
then
    majorversionposition="${prefix}${position}0${subposition}"
else
    majorversionposition="${prefix}${position}${subposition}"
fi

dir="general/releases/${version}"
mkdir -p "${dir}"

./scripts/wikimedia-fetch.js migrate-batch "Moodle_${version}." ${dir}/ "Moodle (.*) release notes" '$1.md' \
    --title-search " release notes" --title-replacement "" \
    --position-regex "\d\.\d+\.(?<position>\d+).*$" \
    --version-regex "Moodle (?<moodleVersion>.*)"

./scripts/wikimedia-fetch.js migrate "Moodle_${version}_release_notes" ${dir}.md \
    --title-search " release notes" --title-replacement "" \
    --version-regex "Moodle (?<moodleVersion>.*)" \
    --position "${majorversionposition}" --invert-position \
    --no-interactive

for file in ${dir}/* ${dir}.md; do
    sed -i '/noinclude/d' "${file}"
    ./scripts/releases/add-translation-header.mjs --debug "${file}"
    ./scripts/releases/stripFullPageName.sh $file
done

yarn markdownlint-cli2 --config scripts/migration/phases/12-admonition/.markdownlint-cli2.cjs "${dir}".md
yarn markdownlint-cli2 --config scripts/migration/phases/12-admonition/.markdownlint-cli2.cjs "${dir}"/*.md

yarn mdlint-all

for file in ${dir}/*.md ${dir}.md; do
    sed -i -E 's/^;(.*) ?: (http.*)$/- [\1](\2)/' "${file}"
    sed -i -E 's/ \]\(/](/' "${file}"
    yarn markdownlint-cli2-fix $file
    yarn markdownlint-cli2-fix $file
done
