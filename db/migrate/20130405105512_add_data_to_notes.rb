class AddDataToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :data, :string
  end
end
