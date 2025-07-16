import json
import re

# Define muscle groups for each exercise
exercise_muscle_groups = {
    "Leg Press": ["quadriceps", "glutes", "hamstrings"],
    "Leg Curl": ["hamstrings", "glutes"],
    "Seated Leg Curl": ["hamstrings", "glutes"],
    "Leg Extension": ["quadriceps"],
    "Abdominal Crunch": ["abs", "core"],
    "Ab Crunch": ["abs", "core"],
    "Ab Pull": ["abs", "core"],
    "Rotary Torso": ["obliques", "core"],
    "Lat Pulldown": ["lats", "rhomboids", "middle trapezius", "rear deltoids", "biceps"],
    "Chest Press": ["pectorals", "anterior deltoids", "triceps"],
    "Seated Row": ["lats", "rhomboids", "middle trapezius", "rear deltoids", "biceps"],
    "Independent Bicep Curl": ["biceps", "brachialis"],
    "Dependent Curl": ["biceps", "brachialis"],
    "Shoulder Press": ["deltoids", "triceps", "upper trapezius"],
    "Tricep Press": ["triceps", "anterior deltoids"],
    "Calf Raises": ["calves", "soleus"],
    "Stationary Bike": ["quadriceps", "glutes", "hamstrings", "calves", "cardiovascular"],
    "Treadmill": ["quadriceps", "glutes", "hamstrings", "calves", "cardiovascular"],
    "Elliptical": ["quadriceps", "glutes", "hamstrings", "calves", "upper body", "cardiovascular"]
}

def add_muscle_groups_to_exercises():
    # Read the JSON file
    with open('server/data/workoutLogs2024.json', 'r') as file:
        data = json.load(file)
    
    # Process each workout log
    for workout in data:
        if 'exercises' in workout:
            for exercise in workout['exercises']:
                if 'name' in exercise:
                    exercise_name = exercise['name']
                    if exercise_name in exercise_muscle_groups:
                        # Add muscle groups if not already present
                        if 'muscleGroups' not in exercise:
                            exercise['muscleGroups'] = exercise_muscle_groups[exercise_name]
                        else:
                            # Update existing muscle groups if needed
                            exercise['muscleGroups'] = exercise_muscle_groups[exercise_name]
    
    # Write back to file with proper formatting
    with open('server/data/workoutLogs2024.json', 'w') as file:
        json.dump(data, file, indent=2)
    
    print("Muscle groups added successfully!")

if __name__ == "__main__":
    add_muscle_groups_to_exercises()
