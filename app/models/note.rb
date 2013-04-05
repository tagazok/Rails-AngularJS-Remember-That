class Note < ActiveRecord::Base
  attr_accessible :color, :content, :status, :title, :data
  serialize :data
end
