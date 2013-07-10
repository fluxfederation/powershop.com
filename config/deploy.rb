require 'capistrano/ext/multistage'

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :copy

namespace :deploy do
  before 'deploy', 'require_tag'
  before 'deploy', 'deploy:generate'

  %i[ start stop restart finalize_update ].each do |t|
    desc "#{t} is a no-op with Jekyll"
    task(t, roles: :web) {}
  end

  task :generate do
    `bundle exec jekyll build`
  end
end

task :require_tag do
  set :branch, ENV['tag'] || raise("Specify the tag to deploy using the tag variable: `cap tag=nn.nn #{application} deploy`")
end
