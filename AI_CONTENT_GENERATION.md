# AI Content Generation with Gemini

This guide explains how to use the AI-powered content generation feature for the Soul Sync admin panel.

## Overview

Soul Sync uses Google's Gemini API to generate various types of spiritual and motivational content automatically. This feature is available exclusively to admin users.

## Features

### 1. **Regular Content Generation** (Built into Card Form)
Generate content for:
- 📖 **Bible Verses** - Complete verses with references
- 💝 **Devotionals** - Inspirational reflections (150-250 words)
- 🙏 **Prayers** - Heartfelt prayers (100-150 words)
- ✨ **Motivational Quotes** - Inspiring quotes with attribution
- 📰 **Articles** - Informative content (200-300 words)
- ✅ **Tasks** - Meaningful daily activities

### 2. **AI Quiz Generator** (Dedicated Modal)
Generate complete quizzes with:
- Multiple choice questions
- 4 options per question
- Correct answer marking
- Explanations for learning
- Customizable difficulty levels
- 3-20 questions per quiz

## How to Use

### Generating Regular Content

1. **Navigate to Admin Panel**
   - Go to `/admin/cards`
   - Click "Create Content" button

2. **Enable AI Generation**
   - Look for the purple "Generate with AI" section
   - Click "Show" to expand the AI input

3. **Enter Theme**
   - Describe the theme, topic, or mood
   - Examples:
     - "hope and encouragement"
     - "overcoming anxiety with faith"
     - "gratitude and thankfulness"
     - "finding peace in difficult times"

4. **Generate**
   - Click the "Generate" button (purple with sparkles icon)
   - Wait 2-5 seconds for generation
   - Review and edit the generated content as needed

5. **Save**
   - Make any edits to the generated content
   - Set points reward and membership level
   - Click "Create" to save

### Generating Quizzes

1. **Open Quiz Generator**
   - Go to `/admin/cards`
   - Click "AI Quiz Generator" button (purple gradient)

2. **Configure Quiz**
   - **Theme/Topic**: What the quiz should be about
     - Examples: "Bible knowledge", "Christian history", "Psalms"
   - **Number of Questions**: 3-20 questions
   - **Difficulty Level**: Easy, Medium, or Hard

3. **Generate**
   - Click "Generate Quiz with AI"
   - Wait 5-10 seconds (longer for more questions)
   - AI will generate questions, options, and explanations

4. **Review & Edit**
   - Review generated questions
   - Edit questions, options, or explanations
   - Mark correct answer by clicking the radio button
   - Delete questions you don't want
   - Add custom questions with the "Add Question" button

5. **Save**
   - Set the title and points reward
   - Click "Create Quiz" to save to database

## Content Types & Prompts

### Verse Generation
- Selects appropriate Bible verses
- Provides complete verse text (NIV/NLT style)
- Includes proper reference (Book Chapter:Verse)
- Generates engaging title
- Theme-specific selection

### Devotional Generation
- 150-250 word inspirational message
- Practical and relatable content
- Includes reflection question or takeaway
- Warm, personal tone
- Faith-based without being preachy

### Prayer Generation
- 100-150 word heartfelt prayer
- Conversational, accessible language
- Sincere and hopeful tone
- Appropriate for diverse audiences
- Theme-aligned content

### Motivational Quote Generation
- 15-40 word powerful quote
- Uplifting and actionable
- Includes author attribution
- Can generate original or use famous quotes
- Theme-relevant selection

### Article Generation
- 200-300 word informative content
- 3-5 actionable tips or insights
- Short paragraphs for readability
- Practical and encouraging
- Professional tone

### Task Generation
- Clear, actionable task description
- Brief explanation of importance
- Achievable and meaningful
- 3-6 word title
- Motivating subtitle

### Quiz Generation
- Educational and engaging questions
- Plausible distractors (wrong options)
- Tests understanding, not just memory
- Clear explanations for learning
- Appropriate difficulty level
- Faith-based and non-controversial

## API Endpoints

### `/api/admin/generate-content`
**POST** - Generate regular content

**Request:**
```json
{
  "type": "verse" | "devotional" | "prayer" | "motivational" | "article" | "task",
  "theme": "string (min 3 characters)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "string",
    "title": "string",
    "subtitle": "string | null",
    "content": {
      // Type-specific content fields
    }
  }
}
```

### `/api/admin/generate-quiz`
**POST** - Generate quiz content

**Request:**
```json
{
  "theme": "string (min 3 characters)",
  "numQuestions": 3-20,
  "difficulty": "easy" | "medium" | "hard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "subtitle": "string",
    "questions": [
      {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "correct_answer": 0-3,
        "explanation": "string"
      }
    ]
  }
}
```

## Best Practices

### Theme Selection
✅ **Good themes:**
- "finding hope in difficult times"
- "gratitude and thankfulness"
- "overcoming anxiety with prayer"
- "Bible heroes and their lessons"

❌ **Avoid:**
- Too vague: "good", "nice", "spiritual"
- Too broad: "everything", "general"
- Controversial topics

### Content Review
1. **Always review AI-generated content** before publishing
2. **Check facts** - especially Bible references
3. **Verify tone** - ensure it matches your brand
4. **Edit for clarity** - AI is good but not perfect
5. **Test quizzes** - make sure questions make sense

### Quality Control
- Generate multiple versions and pick the best
- Combine AI content with manual editing
- Use AI as a starting point, not final product
- Maintain consistency with existing content
- Keep your audience in mind

## Technical Details

### Model Used
- **Gemini 2.5 Flash** - Fast and efficient
- Temperature: 0.8-0.9 for creativity
- Max output tokens: 2048-4096

### Rate Limits
- No hard limits currently
- Be mindful of API costs
- Generate responsibly

### Error Handling
- Invalid JSON responses are caught and retried
- Parse errors show user-friendly messages
- Network errors are logged and displayed

### Security
- **Admin-only access** - Checked via database
- **Server-side validation** - All inputs validated
- **Authentication required** - No anonymous access

## Troubleshooting

### "AI generated invalid content"
- **Cause**: Gemini returned malformed JSON
- **Solution**: Try again with a clearer theme
- **Prevention**: Be specific in your theme description

### "Failed to generate content"
- **Cause**: API error or network issue
- **Solution**: Check your internet connection and API key
- **Prevention**: Ensure GEMINI_API_KEY is set in `.env.local`

### Generated content is off-topic
- **Cause**: Theme too vague
- **Solution**: Be more specific in theme description
- **Example**: Instead of "hope", use "finding hope during loss"

### Quiz questions are too easy/hard
- **Solution**: Adjust difficulty level
- **Tip**: Medium is balanced for most audiences

## Environment Setup

Ensure your `.env.local` file contains:
```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

## Future Enhancements

Planned features:
- [ ] Bulk content generation
- [ ] Content scheduling
- [ ] Multi-language support
- [ ] Image generation for cards
- [ ] Audio prayer generation
- [ ] Game content generation
- [ ] Content quality scoring
- [ ] A/B testing suggestions

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Test with simple themes first
4. Contact development team

---

**Powered by Google Gemini 2.5 Flash** ✨
