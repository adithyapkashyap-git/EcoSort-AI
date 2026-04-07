import { InferenceClient } from '@huggingface/inference';
import { classifyWithBrowserVision, warmUpBrowserVision } from '../utils/browserVision';
import { candidateLabels } from '../data/wasteProfiles';
import { buildFallbackLabel, buildWasteResult } from '../utils/waste';

const defaultModel = 'openai/clip-vit-large-patch14-336';

export async function warmUpClassification() {
  try {
    await warmUpBrowserVision();
  } catch (error) {
    console.warn('Browser vision warm-up failed. Falling back when needed.', error);
  }
}

export async function classifyWasteImage(file, imageUrl) {
  const token = import.meta.env.VITE_HF_TOKEN;
  const model = import.meta.env.VITE_HF_MODEL || defaultModel;

  try {
    const browserVisionResult = await classifyWithBrowserVision(imageUrl);

    if (browserVisionResult) {
      return buildWasteResult({
        label: browserVisionResult.label,
        confidence: browserVisionResult.confidence,
        imageUrl,
        source: browserVisionResult.source,
      });
    }
  } catch (error) {
    console.warn('Browser vision classification failed, trying cloud fallback.', error);
  }

  if (!token) {
    const fallbackLabel = buildFallbackLabel(file.name);
    return buildWasteResult({
      label: fallbackLabel,
      confidence: 0.46,
      imageUrl,
      source: 'filename-fallback',
    });
  }

  try {
    const client = new InferenceClient(token);
    const predictions = await client.zeroShotImageClassification({
      model,
      inputs: {
        image: file,
        candidate_labels: candidateLabels,
      },
    });

    const topPrediction = predictions?.[0];

    if (!topPrediction) {
      throw new Error('The classification response was empty.');
    }

    return buildWasteResult({
      label: topPrediction.label,
      confidence: topPrediction.score,
      imageUrl,
      source: 'hugging-face',
    });
  } catch (error) {
    console.error('Falling back to filename classification.', error);

    return buildWasteResult({
      label: buildFallbackLabel(file.name),
      confidence: 0.44,
      imageUrl,
      source: 'filename-fallback',
    });
  }
}
