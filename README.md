[![Build Status](https://dev.azure.com/mitchdenny/ecdc/_apis/build/status/mitchdenny.ecdc?branchName=master)](https://dev.azure.com/mitchdenny/ecdc/_build/latest?definitionId=2&branchName=master)

# ECDC

The Encode/Decode (ecdc) extension allows you to quickly convert one or more selections of text to and from various formats. Supported conversions include:

* String to Base64
* Base 64 to String
* String to JSON Byte Array
* Base64 to JSON Byte Array
* String to MD5 Hash (as Base64 or Hex)
* String to HTML Entities
* HTML Entities to String
* String to XML Entities
* XML Entities to String
* String to Unicode
* Unicode to String
* String to Encoded Url
* Encoded Url to String
* String to Encoded Url Component
* Encoded Url Component to String
* String to All Characters Encoded Url Component

## How to Use

The extension provides a single command to the command palette. To active the command simply launch the command palette (`Shift-CMD-P` on OSX or `Shift-Ctrl-P` on Windows and Linux), then just type `Encode/Decode: Convert Selection`, then a menu of possible conversions will be displayed. Alternatively you can use the keyboard bindings CMD-ALT-C and CTRL-ALT-C for Mac & PC respectively.

## Contributors

Thanks to everyone who has submitted issues and pull requests, shout outs to:

* 7sDream
* fcharron
* jtanx
