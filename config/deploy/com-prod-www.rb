set :application, 'com-prod-www'
set :repository,  'git@git.powershop.co.nz:web/powershop-com.git'
set :deploy_to,   "/apps/#{application}"

role :web, 'assl1', 'assl2', 'com-gateway-wlg1', 'com-gateway-wlg2'

set :gateway,
  'assl.powershop.co.nz' => ['assl1', 'assl2'],
  'gateway-wlg.powershop.co.nz' => ['com-gateway-wlg1', 'com-gateway-wlg2']
