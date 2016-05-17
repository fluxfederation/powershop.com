set :application, 'com-prod-www'
set :repository,  'git@git.powershop.co.nz:web/powershop-com.git'
set :deploy_to,   "/apps/#{application}"

role :web, 'com-gateway-akl1', 'com-gateway-akl2', 'com-gateway-wlg1', 'com-gateway-wlg2'
