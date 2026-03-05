import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: importData } = await req.json()

    const results = {
      visa: false,
      premiumContent: 0,
      documents: 0,
      timelineEntries: 0,
      errors: [] as string[]
    }

    // Step 1: Get or create visa
    const visaData = importData.visa
    
    const { data: existingVisa } = await supabaseAdmin
      .from('visas')
      .select('id')
      .eq('subclass', visaData.subclass)
      .maybeSingle()

    let visaId: string

    if (existingVisa) {
      const { error: updateError } = await supabaseAdmin
        .from('visas')
        .update({
          name: visaData.name,
          category: visaData.category,
          summary: visaData.summary,
          description: visaData.description,
          duration: visaData.duration,
          cost_aud: visaData.cost_aud,
          processing_time_range: visaData.processing_time_range,
          official_url: visaData.official_url,
          key_requirements: visaData.key_requirements,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingVisa.id)
      
      if (updateError) throw updateError
      visaId = existingVisa.id
      results.visa = true
    } else {
      const { data: newVisa, error: insertError } = await supabaseAdmin
        .from('visas')
        .insert({
          subclass: visaData.subclass,
          name: visaData.name,
          category: visaData.category,
          country: 'Australia',
          summary: visaData.summary,
          description: visaData.description,
          duration: visaData.duration,
          cost_aud: visaData.cost_aud,
          processing_time_range: visaData.processing_time_range,
          official_url: visaData.official_url,
          key_requirements: visaData.key_requirements,
          is_active: true
        })
        .select('id')
        .single()

      if (insertError) throw insertError
      visaId = newVisa.id
      results.visa = true
    }

    // Step 2: Import premium content
    if (importData.premium_content?.length > 0) {
      for (const content of importData.premium_content) {
        // Delete existing first to avoid conflicts
        await supabaseAdmin
          .from('visa_premium_content')
          .delete()
          .eq('visa_id', visaId)
          .eq('section_number', content.section_number)

        const { error: contentError } = await supabaseAdmin
          .from('visa_premium_content')
          .insert({
            visa_id: visaId,
            section_number: content.section_number,
            title: content.title,
            section_title: content.title,
            content_type: content.content_type,
            content: content.content,
            file_urls: content.file_urls || [],
            is_published: content.is_published ?? true,
            tips: content.tips,
            description: content.title,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (!contentError) results.premiumContent++
        else results.errors.push(`Premium content ${content.section_number}: ${contentError.message}`)
      }
    }

    // Step 3: Import documents
    if (importData.documents?.required?.length > 0) {
      // Delete existing documents
      await supabaseAdmin
        .from('visa_documents')
        .delete()
        .eq('visa_id', visaId)

      for (const doc of importData.documents.required) {
        const { error: docError } = await supabaseAdmin
          .from('visa_documents')
          .insert({
            visa_id: visaId,
            name: doc.name,
            description: doc.description,
            is_mandatory: doc.is_mandatory,
            document_type: doc.document_type,
            file_naming_pattern: doc.file_naming_pattern,
            max_file_size_mb: doc.max_file_size_mb,
            allowed_formats: doc.allowed_formats,
            checklist_order: doc.checklist_order,
            tips: doc.tips
          })

        if (!docError) results.documents++
      }
    }

    // Step 4: Import timeline entries
    if (importData.timeline_tracker?.entries?.length > 0) {
      for (const entry of importData.timeline_tracker.entries) {
        const { error: entryError } = await supabaseAdmin
          .from('tracker_entries')
          .insert({
            visa_id: visaId,
            application_date: entry.application_date,
            decision_date: entry.decision_date,
            status: entry.status,
            country: entry.country,
            notes: entry.notes,
            is_public: entry.is_public ?? true,
            created_at: new Date().toISOString()
          })

        if (!entryError) results.timelineEntries++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Imported visa ${visaData.subclass} successfully`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
