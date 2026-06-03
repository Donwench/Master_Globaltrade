import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'vi', 'th',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLanguage = 'en', targetLanguage, context = 'general' } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return NextResponse.json(
        { error: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(', ')}` },
        { status: 400 }
      );
    }

    if (sourceLanguage === targetLanguage) {
      return NextResponse.json(
        { error: 'Source and target languages cannot be the same' },
        { status: 400 }
      );
    }

    // Translate text
    const translation = await translateText(text, sourceLanguage, targetLanguage, context);

    // Store translation
    const { data: transRecord, error: dbError } = await supabase
      .from('ai_translations')
      .insert([
        {
          original_text: text,
          translated_text: translation.translatedText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          context,
          confidence_score: translation.confidenceScore,
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        translation: {
          id: transRecord.id,
          originalText: text,
          translatedText: translation.translatedText,
          sourceLanguage,
          targetLanguage,
          confidenceScore: translation.confidenceScore,
          context,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceLanguage = searchParams.get('sourceLanguage');
    const targetLanguage = searchParams.get('targetLanguage');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    let query = supabase
      .from('ai_translations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (sourceLanguage) {
      query = query.eq('source_language', sourceLanguage);
    }
    if (targetLanguage) {
      query = query.eq('target_language', targetLanguage);
    }

    const { data, error, count } = await query.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Fetch translations error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  context: string
): Promise<{ translatedText: string; confidenceScore: number }> {
  // Mock translation engine - integrate with Claude API, Google Translate, or DeepL in production
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi',
    vi: 'Vietnamese',
    th: 'Thai',
  };

  // Simulated translation with confidence score
  const translatedText = `[${languageNames[targetLanguage]} translation of: "${text}"]`;
  const confidenceScore = 0.85 + Math.random() * 0.15; // 0.85-1.0

  return {
    translatedText,
    confidenceScore: parseFloat(confidenceScore.toFixed(2)),
  };
}
