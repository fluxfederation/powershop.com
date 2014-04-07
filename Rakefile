desc "Outputs the git log between the last two tags"
task :diff_tags do
  puts log_both_ways(last_two_tags)
end

task :diff_tags_files do
  puts files_changed(last_two_tags)
end

task :diff_since_last_tag do
  puts log_both_ways(last_tag_to_head)
end

task :diff_since_last_tag_files do
  puts files_changed(last_tag_to_head)
end

def last_two_tags
  if ENV['TAGS']
    ENV['TAGS'].split('..')
  else
    last_two_tags_in_branch
  end
end

def last_two_tags_in_ref
  `git for-each-ref --sort=-authordate --count=2 refs/tags --format '%(refname:short)'`.split(/\n/).reverse
end

def last_two_tags_in_branch
  tag = `git describe --tags --abbrev=0`.chomp
  [`git describe --tags --abbrev=0 #{tag}^`.chomp, tag]
end

def last_tag_to_head
  if ENV['TAG']
    [ENV['TAG'], 'HEAD']
  else
    [`git for-each-ref --sort=-authordate --count=1 refs/tags --format '%(refname:short)'`.gsub(/\n/,''), 'HEAD']
  end
end

def gitlog(tags)
  "==== GIT LOG BETWEEN TAGS #{tags.join ' and '} ====\n" +
    `git log --cherry-pick --pretty="format:%h %N%s (%an)" --date=short --reverse --no-merges --topo-order #{tags.join '..'} \`ls | grep -vE '^(spec|features|tsung)$'\``
end

def log_both_ways(tags)
  result = gitlog(tags)
  removed = gitlog(tags.reverse)
  if removed.split(/\n/).length > 1
    result << "\nThe following commits are in #{tags.first} and not in #{tags.last}\n"
    result << removed
  end
  result
end

def files_changed(tags)
  "==== GIT DIFF BETWEEN TAGS #{tags.join ' and '} ====\n" +
    `git diff --name-only #{tags.join '..'}`
end
