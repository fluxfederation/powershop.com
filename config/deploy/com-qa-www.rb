set :application, 'com-qa-www'
set :repository,  'git@git.powershop.co.nz:web/powershop-com.git'
set :gateway,     'wssl.powershop.co.nz'
set :deploy_to,   "/apps/#{application}"

role :web, 'wssl1', 'wssl2'
