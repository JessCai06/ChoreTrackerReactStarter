Rails.application.routes.draw do
  # Generated routes for models
  resources :chores
  resources :tasks
  resources :children
  
  # Setting default route
  root to: 'chores#index'

  # API routing
  scope module: 'api', defaults: {format: 'json'} do
    namespace :v1 do
        get 'chores', to: 'chores#index'
        put 'chores/:id/toggle_status', to: 'chores#toggle_status'

        get 'children', to: 'chores#children'  # for select options for children
        get 'tasks', to: 'chores#tasks'        # for select options for tasks
        post 'create_chore', to: 'chores#create'  # to add the record to the database
    end
  end
    
  
end
