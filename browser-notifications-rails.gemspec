require File.expand_path('../lib/browser-notifications-rails/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = 'browser-notifications-rails'
  s.version     = Browser::Notifications::Rails::VERSION
  s.platform    = Gem::Platform::RUBY
  s.files       = Dir['{lib,vendor}/**/*'] + ['LICENSE', 'THIRD-PARTY-LICENSE.md', 'README.md']
  s.authors     = ['YUKI', 'Atom Authors']
  s.email       = []
  s.homepage    = 'https://github.com/yukimono/browser-notifications-rails'
  s.summary     = 'Atom\'s user notifications with Rails\' asset pipeline'
  s.description = ''
  s.license     = 'MIT'
  s.add_dependency 'railties', '>= 3.2', '< 5.0'
end
