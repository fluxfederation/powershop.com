set :application, 'com-prod-www'
set :repository,  'git@git.powershop.co.nz:web/powershop-com.git'
set :gateway,     'assl.powershop.co.nz'
set :deploy_to,   "/apps/#{application}"

role :web, 'assl1', 'assl2'
