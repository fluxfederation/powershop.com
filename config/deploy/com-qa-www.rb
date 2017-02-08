set :application, 'com-qa-www'
set :repository,  'git@git.powershop.co.nz:web/powershop-com.git'
set :deploy_to,   "/apps/#{application}"

role :web, 'hq-gateway-akl1', 'hq-gateway-akl2', 'hq-gateway-wlg1', 'hq-gateway-wlg2'
