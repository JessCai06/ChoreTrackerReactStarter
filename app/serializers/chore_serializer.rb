class ChoreSerializer
  include FastJsonapi::ObjectSerializer
  attribute :child_name do |object|
    object.child.name
    end

    attribute :task_name do |object|
    object.task.name
    end

    attribute :due_on

    attribute :status do |object|
    object.status
    end
end
