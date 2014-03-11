require 'capistrano/ext/multistage'

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :copy
set :build_script, 'bundle exec jekyll build'

namespace :deploy do
  before 'deploy', 'require_tag'
  before  "deploy:finalize_update", "deploy:make_tag"

  %i[ start stop restart finalize_update ].each do |t|
    desc "#{t} is a no-op with Jekyll"
    task(t, roles: :web) {}
  end

  desc "Make a TAG file showing which git tag has been released"
  task :make_tag do
    run "umask 02 && echo '#{branch}' > #{release_path}/TAG"
  end
end

task :require_tag do
  set :branch, ENV['tag'] || raise("Specify the tag to deploy using the tag variable: `cap tag=nn.nn #{application} deploy`")
end

namespace :app do
  desc "Show the current TAG"
  task :show_tag do
    run "cat #{current_path}/TAG"
  end
end
