module Browser
  module Notifications
    module Rails
      class Engine < ::Rails::Engine
        initializer 'browser-notifications-rails.setup', :group => :all do |app|
          app.config.assets.paths << File.join(config.root, 'vendor', 'toolkit')
        end
      end
    end
  end
end
