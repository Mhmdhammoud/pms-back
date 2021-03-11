## Project Management System

### Collections

#### Project

<hr>
<ol>
	<li>duration</li>
	<li>starting_date</li>
	<li>title</li>
	<li>timestamps</li>
	<li>
		project_employees
		<ol>
			<li>name</li>
			<li>id</li>
			<li>image</li>
		</ol>
	</li>
	<li>
		milestones
		<ol>
			<li>end_date</li>
			<li>title</li>
		</ol>
	</li>
	<li>
		tasks
		<ol>
			<li>title</li>
			<li>id</li>
			<li>employee_name</li>
			<li>employee_image</li>
			<li>duration</li>
			<li>deadline</li>
			<li>starting_date</li>
			<li>
				comments
				<ol>
					<li>id</li>
					<li>text</li>
					<li>ownerID</li>
					<li>owner_name</li>
					<li>owner_image</li>
					<li>timestamps</li>
				</ol>
			</li>
			<li>
				files
				<ol>
				<li>URL</li>
				<li>timestamps</li>
				<li>owner
				<ol>
						<li>id</li>
				<li>owner_name</li>
				<li>owner_image</li>
				</ol>
				</li>
				</ol>
			</li>
		</ol>
	</li>
</ol>

### manager

|
|**id
|**phone
|**email
|**name
|**image
|**timestamps
|**password
|**projects
|
|**projectname
|**projectID

#### employees

|
|**id
|**phone
|**email
|**name
|**image
|**timestamps
|**password
|**tasks
| |
| |**taskid
| |**title
|
|**projects
|
|**projectname
|\_\_projectID

#### Administrator

|
|**id
|**phone
|**email
|**name
|**image
|**timestamps
|\_\_password
