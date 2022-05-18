#!/bin/sh

input=$1

sed -i '/Releases.* {{FULLPAGENAME}}/{N;d;}' $input
sed -i '/This version of Moodle is no longer supported/d' $input
sed -i '/This version of Moodle is no longer fully supported/d' $input
