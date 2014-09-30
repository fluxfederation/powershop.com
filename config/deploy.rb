require 'capistrano/ext/multistage'

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, false
set :deploy_via, :copy
set :build_script, 'bundle exec jekyll build'

namespace :deploy do
  before 'deploy', 'require_tag'
  before "deploy:finalize_update", "deploy:make_tag"
  after  "deploy:make_tag",        "deploy:tag_text"
  before "deploy:finalize_update", "deploy:update_release_branch"

  %i[ start stop restart finalize_update ].each do |t|
    desc "#{t} is a no-op with Jekyll"
    task(t, roles: :web) {}
  end

  desc "Make a TAG file showing which git tag has been released"
  task :make_tag do
    run "umask 02 && echo '#{branch}' > #{release_path}/TAG"
  end

  desc "Make a tag.txt file accesible for all to see what git tag has been released"
  task :tag_text do
    run "umask 02 && echo '#{branch}' > #{release_path}/_site/tag.txt"
  end

  desc "Update the last-release branch for the given application"
  task :update_release_branch do
    run_locally "git push -f origin #{branch}:refs/heads/current-#{application}"
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
