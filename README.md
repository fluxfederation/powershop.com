# README

## Requirements

- Node / NPM
- GruntJS
- Ruby
- Jekyll

## Setup

    bundle
    # To build the site into _site/
    jekyll build
    # To serve the site from your dev environment

## Webserver

Setup a VirtualHost to point to the _site/ folder. This should be the base
directory.

	<VirtualHost *:80>
		ServerName power.dev
		DocumentRoot /Users/will.rossiter/Sites/pow_com/_site/
	</VirtualHost>

Configure your webserver to serve 404.html as the error page using the virtual
host

	ErrorDocument 404 /Users/will.rossiter/Sites/pow_com/_site/404.html
