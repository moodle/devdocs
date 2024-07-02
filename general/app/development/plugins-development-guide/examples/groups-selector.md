---
title: Groups Selector
tags:
  - Moodle App
---

If you have an activity that uses groups, you may want to implement a group selector to filter the rendered content. There are many ways to achieve this, and we're going to outline some of them in this example.

However, before looking at the solutions, we're going to simplify the use-case. Normally, you'd use functions like `groups_get_activity_allowed_groups` to get the list of groups; and filter content according to each group's permissions. But in this example, we're going to rely on a `$groups` variable containing a list of items for each group:

```php
$groups = [
    [
        'name' => 'One',
        'items' => [
            ['name' => '1.1'],
            ['name' => '1.2'],
        ],
    ],
    [
        'name' => 'Two',
        'items' => [
            ['name' => '2.1'],
            ['name' => '2.2'],
            ['name' => '2.3'],
        ],
    ],
];
```

The UI we're going to implement will show a groups selector with the list of items below. With this, you should learn the intricacies of App development without getting into the weeds of group management.

## Using Angular

One approach is to send all the relevant data through `otherdata`, and filter the content using Angular:

```php title="Content response"
return [
    'templates' => [
        [
            'id' => 'main',
            'html' => $OUTPUT->render_from_template('local_sample/groups', []),
        ],
    ],
    'otherdata' => [
        'groups' => json_encode($groups),
        'selectedGroup' => 0,
    ],
];
```

```html ng2 title="Template"
{{=<% %>=}}
<ion-list>
    <ion-item>
        <ion-select label="Group" [(ngModel)]="CONTENT_OTHERDATA.selectedGroup">
            <ion-select-option
                *ngFor="let group of CONTENT_OTHERDATA.groups; index as index"
                [value]="index"
            >
                {{ group.name }}
            </ion-select-option>
        </ion-select>
    </ion-item>
    <ion-item *ngFor="let item of CONTENT_OTHERDATA.groups[CONTENT_OTHERDATA.selectedGroup].items">
        <ion-label>{{ item.name }}</ion-label>
    </ion-item>
</ion-list>
```

One advantage of this approach is that it can work completely offline, once the template has been downloaded it can be cached and the selector will work without requesting new information. However, it will require performing a PTR (Pull-To-Refresh) to get the latest information.

## Loading new content

If we want to render new content every time the selector is changed, we can take advantage of the [functions available in templates](../api-reference.md#functions):

```php title="Content response"
$group = $args['group'] ?? 'One';
$groupnames = array_map(fn ($group) => $group['name'], $groups);
$selectedgroup = array_search($group, $groupnames) || 0;

return [
    'templates' => [
        [
            'id' => 'main',
            'html' => $OUTPUT->render_from_template('local_sample/groups', [
                'groups' => $groups,
                'selectedgroup' => $groups[$selectedgroup],
            ]),
        ],
    ],
];
```

```html ng2 title="Template"
{{=<% %>=}}
<ion-list>
    <ion-item>
        <ion-select
            label="Group"
            (ionChange)="updateContent({ group: $event.target.value })"
            value="<% selectedgroup.name %>"
        >
            <%# groups %>
                <ion-select-option value="<% name %>">
                    <% name %>
                </ion-select-option>
            <%/ groups %>
        </ion-select>
    </ion-item>
    <%# selectedgroup.items %>
        <ion-item>
            <ion-label><% name %></ion-label>
        </ion-item>
    <%/ selectedgroup.items %>
</ion-list>
```

In this case, we're only sending the rendered UI and all the filtering happens in the server. Using the `ionChange` listener, we can call the `updateContent` function to reload the content with a different group selected. We got the value of the selected option using the special `$event` variable that references the change event.

Also, make sure to set the `value` attribute in the `ion-select` element, so that the initial group is the correct one.
