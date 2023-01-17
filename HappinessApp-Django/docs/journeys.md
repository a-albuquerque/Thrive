# The Journey API

> Note: To get an overview of the backend structure, have a look at the README
> file under the `docs` folder.

Under the `journeys` folder, you will find the models, views, and URL routes for
the handling of chats and messages between users.

## Routes

Here is a list of all the URL routes for this backend

***TODO***

## Models

So far, `journeys` Django app mainly implements two pairs of related models: the
`Quest` and `Journey` models, and the `SubmittedQuest` and `SubmittedJourney`
models.

### Journey model

The `Journey` model contains the metadata information for each series of quests
and defines a many-to-many relationship with the `Quest` model through the
intermediate `JourneyQuest` model. Any instance of the `Journey` model contains
the following fields:

- `name`: A 100-character `CharField` containing the name of the journey.

- `description`: A `TextField` contaning a more detailed description of the
journey and its purpose.

- `media`: An `ImageField` for a decorative image for the journey. It holds no
special value other than aesthetics and may be unused.

- `video`: A `URLField` for the link to a video resource for the journey. Like
the image it serves an aesthetic purpose and may remain unused.

- `quests`: The set of quests that compose a journey, related through a
`ManyToManyField`. Do note that this relationship is defined through another
model, called the `JourneyQuest` model, which determines

In short, the `Journey` model represents the following relation:

```txt
relation Journey (
    
)
```

### Quest model

The `Quest` model contains the data stored in chat messages. Any instance of
the `Quest` model contains the following fields:

- `name`: A 100-character `CharField` containing the name of the quest.

- `description`: A `TextField` contaning a more detailed description of the
quest activity and its components.

- `media`: An `ImageField` to decorate the quest. It holds no special value
other than aesthetics and may go unused. This field is optional.

- `video`: A `URLField` for the link to a video resource for the quest. Like
the image it serves an aesthetic purpose and may go unused. This field is
optional.

- `survey_question`: ***TODO***

- `estimated_time`: An `IntegerField` of the estimated amount of minutes the
quest should take to complete. This field is optional.

- `difficulty`: An `IntegerField` representing the "difficulty" of a quest,
(duh). This field is optional.

In short, the `Quest` model represents the following relation:

```txt
relation Quest (

)
```

### JourneyQuest model

The `JourneyQuest` model defines a middleman relationship between the `Quest`
model and the `Journey` model. It represents an "instance" of a quest that is
included on a journey and is to be performed as the ith quest of the journey,
where i is order represented in the relation. This model contains the following
fields:

- `journey`: A `ForeignKey` field that relates the quest instance to the
`Journey` model.

- `quest`: A `ForeignKey` field that relates the "quest instance" to the `Quest`
it originates from.

- `order`: An `IntegerField` representing the position of this quest instance in
the ordered sequence of quests for the journey.

Note that a triple of a journey, a quest, and an order is unique.

### SubmittedJourney model

```txt
relation SubmittedJourney (

)
```

### SubmittedQuest model

```txt
relation SubmittedQuest (
    
)
```
