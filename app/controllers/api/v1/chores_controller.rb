module Api::V1
  class ChoresController < ApiController
    def index
      @chores = Chore.chronological
      render json: ChoreSerializer.new(@chores).serialized_json
    end

    def toggle_status
      @chore = Chore.find(params[:id])
      @chore.toggle_status
      render json: ChoreSerializer.new(@chore).serialized_json
      end

    def create
  @chore = Chore.new(chore_params)
  @chore.completed = false  # by default, a new chore isn't completed yet
  @chore.save
  render json: ChoreSerializer.new(@chore).serialized_json
end

private
def chore_params
  params.require(:chore).permit(:child_id, :task_id, :due_on)
end
  end
end
