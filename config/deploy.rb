require 'capistrano/ext/multistage'

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :copy
set :build_script, 'bundle exec jekyll build'

namespace :deploy do
  before 'deploy', 'require_tag'

  %i[ start stop restart finalize_update ].each do |t|
    desc "#{t} is a no-op with Jekyll"
    task(t, roles: :web) {}
  end
end

task :require_tag do
  set :branch, ENV['tag'] || raise("Specify the tag to deploy using the tag variable: `cap tag=nn.nn #{application} deploy`")
end
