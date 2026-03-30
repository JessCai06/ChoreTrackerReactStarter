# Lab 11: ChoreTracker UX Improvements with React

As seen in lecture, we can leverage the React to allow for cool, dynamic effects on the front-end of our application. Part of the reason we may wish to use something like this would be to improve the user experience (or UX for short) of an application. Nowadays, the demand for real-time updates is higher than ever. We want to complete everything in a short of a time as we possibly can. React supports this outlook onto completing tasks.

Before going any further, it is worth keeping the [React documentation](https://react.dev/learn) open, as you may wish to refer to it to better understand the framework.

## Part 1: Setup and Installation

First thing is that we have to have npm (node package manager) and yarn set up on your machine. You can check for npm with the command `npm -v` and see what version (if any) you have. If you don't have npm, you can either install it with a package manager (e.g., [Homebrew](https://brew.sh/) or get it directly at [https://nodejs.org/en/download](https://nodejs.org/en/download). If installing npm, confirm the installation with `npm -v` before moving forward.

Once you have npm, you will need yarn. Again, you may already have yarn and can check with the command, `yarn -v`. If needed, you can install yarn with the command `npm install --global yarn`. Verify it's installed with the command `yarn -v`

For this lab, we are going to implement several features using React into Chore Tracker from before. We've provided starter code here for your convenience.

1. Clone the [starter code repository](https://github.com/67272-App-Design-Dev/ChoreTrackerReactStarter). _Be sure to remove any remote connections on the repository with_ `git remote rm origin`. As always, move off the 'main' branch to a development branch (i.e., `git checkout -b dev`) and only save work back to main when it's good to go.

   After cloning, install the Ruby and JavaScript dependencies before doing anything else:

   ```bash
   bundle install
   yarn install
   ```

1. In your Gemfile, we have updated gems for Rails 8.1.1 compatibility:

   ```ruby
   gem "shakapacker", "~> 8.0"
   gem "react-rails", "~> 3.2"
   gem "sassc-rails"     # Sprockets-compatible Sass processor (required for .scss assets)
   ```

   These gems will make it easy for us to integrate React into an already existing Rails app. Going to the [react-rails](https://github.com/reactjs/react-rails) gem repo will bring up some of the documentation with this gem and could be a helpful reference.

1. In order to speed up the lab, we have done some important setup steps for you in advance. This is for information purposes, and **does not have to be repeated now.** (_Here for educational purposes only_)

   ```bash
   rails shakapacker:install

   yarn add react react-dom @babel/preset-react prop-types \
     css-loader style-loader mini-css-extract-plugin css-minimizer-webpack-plugin
   ```

   This set up webpacker and installed all of the neccessary packages for react to work properly as well as a custom javascript compiler for your project so that you can write and use js code within your ruby project.

   Additionally, we updates the `babel` configuration as well as the `react_ujs` configuration in two places within the `package.json` file.

   ```js
     "babel": {
       "presets": [
         "./node_modules/shakapacker/package/babel/preset.js",
         "@babel/preset-react"
       ]
     },

     "dependencies": {
         "react_ujs": "react_ujs",
     }
   ```

   We also modified `config/shakapacker.yml` and changed the `source_entry_path` to:

   ```yml
   source_entry_path: packs
   ```

   After this configuration, we ran the react-rails gem generator with:

   ```bash
     rails generate react:install
   ```

   This created additional folders and components linking your new react packages to your project.

1. To check that react-rails is working properly, let's use the gem to create and show a component run:

   ```bash
   rails g react:component HelloWorld greeting:string
   ```

   The react-rails gem is generating a very basic component which has a prop called `greeting` and will display it. Your component should be now created under the `app/javascript/components/` directory (verify that now and look at the component generated). Note that react-rails 3.2 generates **functional components** by default — you do not need to convert anything. The component explicitly calls the fragment using `<React.Fragment>` rather than the shortcut `<>`.

   Now to actually include the component in your views go to `app/views/chores/index.html.erb` and after the comment put

   ```erb
   <%= react_component("HelloWorld", { greeting: "Hello from react-rails." }) %>
   ```

   Run `rails db:migrate` to set up the database and then `rake db:contexts` to populate it with some testing data. After that, start the server with `bin/rails server` (or `bin/dev` if using Procfile.dev).

   You should now see the component rendered before you. If not, please see a TA/CA for assistance.

   _Add and commit your work to Git if you have not done so already._

   Finally, if you are using the [Brave Browser](https://brave.com/) or Google Chrome (_remember what Prof. H had to say about the creepiness of Chrome and just make the switch to Brave_) and have not done so, install the [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), as it allows for properly checking components and their state, in real-time.

   If you followed all the instructions to this point and you have the extension installed, go to the Javascript Console (an option under 'View/Developer') and select the 'Components' option. You should see something that looks like this:

   ![](https://i.imgur.com/Y31uNs0.png)

## Part 2: Adding the base React instance

Let's spend some time re-familiarizing ourselves with the initial pain points of the Chore Tracker application. We are taking an _iterative refinement_ approach to developing Chore Tracker: In the first lab we were concerned with simply building a working application, and now we are ready to improve it from a UX standpoint.

_This is actually a really important skill to use in industry since stakeholders are looking for results, and then improvement. The sooner you can have something working (some Minimal Viable Product), the better!_

If I go to the 'Children' tab, I see a list of new children, and if I want to add one, I go to a 'new' page with its own route and controller action, and then come back to my list; perhaps not terrible as children are an independent entity in the system. Bur the same process was true of chores, even though chores depends on both Child and Tasks and I need context to set up chores (think back to our discussion of the shortcomings of `visits#show` in PATS_v1). We don't want to switch pages just to add a new chore and then have to come back to our show page immediately -- we just want to do it all on that one page. This is where React comes to the rescue.

To make this happen, start with the following:

1. Generate a new component called `chores` via:

   ```bash
   rails g react:component chores
   ```

1. Open this component and within the fragment JSX, add the following:

   ```jsx
   <div>
     <h2>Listing chores</h2>
     <table>
       <thead>
         <tr>
           <th width="125" align="left">
             Child
           </th>
           <th width="200" align="left">
             Task
           </th>
           <th width="75">Due on</th>
           <th width="75">Status</th>
         </tr>
       </thead>
     </table>
   </div>
   ```

1. Inside of the `views/chores/index.html.erb` template, remove the "HelloWorld" component and instead render this new component. Run the server, go to the chores page and verify that the heading and table show up.

1. This sets up static elements for the index view, but we need to get data for this page. To do that, we need to set up an API call. We've given you a ChoresController under `app/controllers/api/v1` and you will need to add an `index` action with the following:

   ```ruby
   @chores = Chore.chronological
   render json: ChoreSerializer.new(@chores).serialized_json
   ```

   Of course, that means you have a ChoreSerializer, which right now is mostly empty. Add to that the following content:

   ```ruby
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
   ```

   And don't forget to add a route in the appropriate place — specifically **inside the `namespace :v1` block** in `config/routes.rb`. (We aren't telling you how to do this; you should know it by now and this was just a friendly reminder.) Run the server and verify the route is giving you the appropriate json before proceeding further.

1. Now that we have data for chores in json format, we need to use that to populate our page. _(Note: react-rails 3.2 already generates a functional component, so if your `Chores` component already uses `function Chores()` there is nothing to convert — skip directly to fetching the data below.)_

   We have to go fetch the data. As discussed in class, we need to handle the CSRF tag using the `api` components provided, so let's import what we need at the top of the page, after importing React: `import { get } from "../api";`

   Now we can get the data with the following. We are using [useEffect](https://react.dev/reference/react/useEffect) as a React hook that is used to syncronize a component with an external system.

   ```js
   const [chores, setChores] = React.useState([]);

   React.useEffect(() => {
     get("/v1/chores").then((response) => {
       setChores(response.data);
     });
   }, []);
   ```

1. Now that we have the data, we can display it right after the header row in the `return` with the following code:

   ```js
   {
     chores.map((chore) => (
       <tr key={`chore-${chore.id}`}>
         <td>{chore.attributes.child_name}</td>
         <td>{chore.attributes.task_name}</td>
         <td>{FormattedDate(chore.attributes.due_on)}</td>
         <td>{chore.attributes.status}</td>
       </tr>
     ));
   }
   ```

   Run the server and see the page is displayed. Wait! Those dates are a mess. Luckily, we have a component to format dates. Add the following import to the top of `Chores.js`:

   ```js
   import FormattedDate from "./FormattedDate";
   ```

   Then update the date cell in the `map` to call `{FormattedDate(chore.attributes.due_on)}` as shown in the code above. Your page should look something like:

   ![](https://i.imgur.com/kprLuDO.png)

---

**STOP**: Show a TA that you have the basic Chores component working and formatted appropriately (including date).

---

## Part 3: Marking chores as complete

Some of the chores listed are complete and others pending, but it would be nice to mark off completed chores right from the list. To do that, we will need to clean up the code above. It'd be nice if each row in our table was its own component. To do this, check out a new Git branch called 'refactor' so if we hose this, we can easily move back to our 'dev' branch and try again.

1. Create a new file at `app/javascript/components/ChoreItem.js` for the `ChoreItem` component. This component is pretty simple and basically moving code over from our previous component. We are going to import [useState](https://react.dev/reference/react/useState) directly so I don't always have to write `React.useState()`; import with the command `import { useState } from 'react';` and then add:

   ```js
   function ChoreItem({ chore, choreId }) {
     const [thisChore, setThisChore] = useState(chore.attributes);

     return (
       <React.Fragment>
         <tr key={`chore-${choreId}`}>
           <td>{thisChore.child_name}</td>
           <td>{thisChore.task_name}</td>
           <td>{FormattedDate(thisChore.due_on)}</td>
           <td>{thisChore.status}</td>
         </tr>
       </React.Fragment>
     );
   }
   ```

   You will also need these imports at the top of the file:

   ```js
   import React from "react";
   import { useState } from "react";
   import FormattedDate from "./FormattedDate";
   ```

   And be sure to add `export default ChoreItem;` at the bottom of the file.

1. Now we go get to eliminate a lot of code on the main `Chores` component, replacing our loop with the following:

   ```js
   {
     chores.map((chore) => (
       <ChoreItem key={`chore-${chore.id}`} chore={chore} choreId={chore.id} />
     ));
   }
   ```

   Don't forget to add the import at the top of `Chores.js`:

   ```js
   import ChoreItem from "./ChoreItem";
   ```

1. We want the final column to be buttons that if we push them, they will toggle between status of complete/pending. To do that, we need the following:
   - a model method that will handle the toggling in the database
   - a controller action that will utilize this
   - an API route to invoke that controller action
   - and then, the appropriate React to make the interface

   Let's get cracking on that...

1. The model method is the easiest. We know you are model-coding ninjas at this point, so we'll make this easy and just give you the method (we leave it to you after lab to write the test for it.)

   ```ruby
   def toggle_status
     self.completed ? self.completed = false : self.completed = true
     self.save
   end
   ```

1. You are closing in on your API ninja status, but maybe not quite there yet, so here's the controller action you need to add to your chores API controller:

   ```ruby
   def toggle_status
     @chore = Chore.find(params[:id])
     @chore.toggle_status
     render json: ChoreSerializer.new(@chore).serialized_json
   end
   ```

   And here's the API route you need to invoke it (add it **inside the `namespace :v1` block** in `config/routes.rb`):

   ```ruby
   put 'chores/:id/toggle_status', to: 'chores#toggle_status'
   ```

1. This is a hedge, but it's not relevant to what we are doing, so we're skipping this for now. Please move along.

   ![](https://i.imgur.com/JgZRebb.jpeg)

   Really, this is a hedge. (_Definitely not ninjas in a clever disguise._) Move along.

1. We have the groundwork laid, but need to update our `ChoreItem` component by making the last column a button to toggle the status. To do that, we'll create a new component called `StatusButton` — create it at `app/javascript/components/StatusButton.js` (or use the generator). Here's a start:

   ```js
   function StatusButton({ choreId, status }) {
     const [thisStatus, setThisStatus] = useState(status);

     return <button>{thisStatus}</button>;
   }
   ```

   _Again: I like to import `useState` so I can refer to it without the `React.` prefix every time I call a useState method and have done so in my code; I recommend that, but not required (although you will have to add it the prefix if you don't...)_

1. Now to make this work, I need to modify the fourth column in the `ChoreItem` component to be:

   ```js
   <td>
     <StatusButton choreId={choreId} status={thisChore.status} />
   </td>
   ```

   Add the following import at the top of `ChoreItem.js`:

   ```js
   import StatusButton from "./StatusButton";
   ```

   Running this will give you a button with the status displayed, but pressing it does nothing. Bummer.

1. What we need is to activate the `onClick` handler, so it will respond to the button press. We can write a method called `toggleStatus()` which utilizes the API endpoint we created to update the database and then update our component. Try this out yourself, but if you need it, there is a solution below.

   In the meanwhile, while you try this out on your own, here's a clip from "The Tick" comic book where the ninjas are mocking our hero (The Tick). Bad move, ninjas, because the Tick is nigh-invulnerable...

   ![](https://i.imgur.com/M7w2Tth.png)
   ![](https://i.imgur.com/X9mLiRc.jpeg)

   If after trying this, you need some help, here's a possible solution:

   ```js
   import { put } from "../api";

   function StatusButton({ choreId, status }) {
     const [thisStatus, setThisStatus] = useState(status);

     function toggleStatus() {
       put(`/v1/chores/${choreId}/toggle_status`).then((response) => {
         const newStatus = thisStatus === "Pending" ? "Completed" : "Pending";
         setThisStatus(newStatus);
       });
     }

     return <button onClick={toggleStatus}>{thisStatus}</button>;
   }
   ```

   Nice thing is that now we have `Chores` component, which has many `ChoreItem` components, each of which has a `StatusButton` component -- a component within a component within a component. As we said in class, with React, it's components all the way down.

---

**STOP**: Show a TA that the chores in the Chores component can update their status, toggling between completed and pending.

---

## Part 4: Adding a new chore

Adding chores is not complicated and something I could and should be able to do within this `Chores` component. Moreover, as I will not be leaving the page, I reduce confusion and cognitive load and can easily see a list of the chores already added.

Following on our theme of "components all the way down", let's start by creating a new component called `ChoreEditor` at `app/javascript/components/ChoreEditor.js`. This editor is going to need a few API endpoints, specifically with the following routes (add them **inside the `namespace :v1` block** in `config/routes.rb`):

```ruby
get 'children', to: 'chores#children'  # for select options for children
get 'tasks', to: 'chores#tasks'        # for select options for tasks
post 'create_chore', to: 'chores#create'  # to add the record to the database
```

Add these routes to `routes.rb` and then create the controller actions and serializers for children and tasks. (For serializers, we only need the `:name` as the `:id` comes automatically.) We will handle the last route later. You can do this without us providing the code (ninja level now).

1. Armed with these, let's open up our new component and add the following code:

   ```js
   import React, { useEffect, useState } from "react";
   import { get, post } from "../api";

   function ChoreEditor() {
     const [childOptions, setChildOptions] = useState([]);
     const [taskOptions, setTaskOptions] = useState([]);
     const [loading, setLoading] = useState();
     const [animating, setAnimating] = useState(false);
     const [child, setChild] = useState();
     const [task, setTask] = useState();
     const [dueOn, setDueOn] = useState("");

     // Let's get the options for our two select menus
     useEffect(() => {
       setLoading(true);
       get(`/v1/children/`).then((response) => {
         setLoading(false);
         setChildOptions(
           response.data.map((child) => {
             return {
               label: child.attributes.name,
               value: child.id,
             };
           }),
         );
       });
       get(`/v1/tasks/`).then((response) => {
         setLoading(false);
         setTaskOptions(
           response.data.map((task) => {
             return {
               label: task.attributes.name,
               value: task.id,
             };
           }),
         );
       });
     }, []);

     if (loading || childOptions?.length === 0) {
       return <div>loading...</div>;
     }

     return (
       <>
         <label htmlFor="children">Child</label>

         <label htmlFor="tasks">Task</label>

         <label htmlFor="due_on">Due On:</label>

         <button>Create Chore</button>
       </>
     );
   }

   export default ChoreEditor;
   ```

1. Now we need to add the two select menus, one for Child and the other for Task. To help you out, we added some form components in `components/shared/form` that we can use -- in this specific case, the `Select` component that we import with the command: `import Select from "./shared/form/Select";`

1. Under the `<label>` for Child, let's now add the following:

   ```js
   <Select
     name="children"
     inputId="children"
     setValue={setChild}
     options={childOptions}
   />
   ```

   And then let's do something similar for Task.

1. It'd be nice if I could actually see this component live, so to do that, return to the `Chores` component. Add the following import at the top of `Chores.js`:

   ```js
   import ChoreEditor from "./ChoreEditor";
   ```

   Then create some `useState` that will allow us to track whether the editor should be visible with the line `const [isEditing, setIsEditing] = useState(false);` right after setting the chores state.

   After that, add the following code after the display of the chores list:

   ```js
   <button onClick={() => setIsEditing(true)}>Create New Chore</button>
   <br />
     {isEditing && (
       <>
         <ChoreEditor />&nbsp;&nbsp;
           <a onClick={() => setIsEditing(false)}>Cancel</a>
       </>
     )}
   ```

   This will allow the editor to display (even if it doesn't actually do anything yet) and you can see the select menus populated.

1. Let's add in the due_on field. We could go get a component for date pickers (there are some [nice ones](https://projects.wojtekmaj.pl/react-date-picker/)) but in the interest of time, we will just go with a straight text field for right now. (Ugly, but easy and fast; dates will have to be added YYYY-MM-DD.) Import our textbox with the command `import StringInput from "./shared/form/StringInput";` and in the form, add after its label:

   ```js
   <StringInput name="due_on" id="due_on" value={dueOn} setValue={setDueOn} />
   ```

1. We need to create a function to save the chore, but first in the controller, we need to add the following to make the route work:

   ```ruby
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
   ```

1. Now we can call on this working endpoint with the following function, right after our code `useEffect` to get the data for the select options:

   ```js
   function createChore() {
     setAnimating(true);
     post(`/v1/create_chore`, {
       chore: {
         child_id: child,
         task_id: task,
         due_on: dueOn,
       },
     }).then((data) => {
       if (data.errors) {
         console.log(data.errors);
       } else {
         onCreateChore(data);
       }
       setAnimating(false);
     });
   }
   ```

1. Of course, this relies on a function `onCreateChore()` that we don't have. Indeed, this is going to come as a prop from the parent component; we can add that in at the top with the following edit: `function ChoreEditor({ onCreateChore }) { ...`. With that, this component is complete, but we need to adjust the parent component to send along the right prop.

1. In the parent component, let's edit the display of the editor to provide this prop to the `ChoreEditor` component with the following:

   ```js
   <ChoreEditor
     onCreateChore={(chore) => {
       addChoreToDisplay(chore);
       setIsEditing(false);
     }}
   />
   ```

   What this is saying is that upon creating a new chore, we want to update the chores display with the new chore and then clear the editor out so it's not visible.

1. We need a function then to update the display. The display will be re-rendered if I call the `setChores` useState function, so we can write the add chore method as follows:

   ```js
   function addChoreToDisplay(chore) {
     setChores((prevChores) => [...prevChores, chore.data]);
   }
   ```

   I recommend putting this function right after `useEffect` call that gets the initial chores data.

Run this and see that it is indeed adding new chores and updating the list. (_Aside: due to time zone issues, your date added might be +1 or -1 day off from the date entered, depending on whether in Pittsburgh or Qatar and the time of day you are doing this -- do not worry about it._)

---

**STOP**: Show a TA that the chore editor component is working properly.

---
