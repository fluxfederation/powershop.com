# README

## Requirements

- Node / NPM
- GruntJS
- Ruby
- Jekyll

## Setup
	
	gem install jekyll
	npm install

## Grunt

Grunt is used to generate combined files, to regenerate files run: 

	grunt watch

Grunt watch is configured to generate all the assets as required and run jekyll
to export the website to the `_site` folder.

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