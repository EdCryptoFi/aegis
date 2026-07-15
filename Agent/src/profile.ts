import { suiClient as client } from './sui-client';

export interface AgentProfile {
  objectId: string;
  name: string;
  description: string;
  imageUrl: string;
  website: string;
  socialTwitter: string;
  updatedAt: number;
}

const PROFILE_REGISTRY = '0xabcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd';

export async function getAgentProfile(agentObjectId: string): Promise<AgentProfile | null> {
  try {
    const objects = await client.getDynamicFields({
      parentId: PROFILE_REGISTRY,
      cursor: null,
      limit: 100,
    });

    for (const obj of objects.data) {
      if (obj.name?.value === agentObjectId) {
        const profileData = await client.getObject({
          id: obj.objectId,
          options: { showContent: true },
        });

        if (profileData.data?.content?.dataType === 'moveObject') {
          const fields = profileData.data.content.fields as any;
          return {
            objectId: agentObjectId,
            name: fields.name || 'Unnamed Agent',
            description: fields.description || '',
            imageUrl: fields.image_url || '',
            website: fields.website || '',
            socialTwitter: fields.social_twitter || '',
            updatedAt: Number(fields.updated_at) || Date.now(),
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get agent profile:', error);
    return null;
  }
}

export function getDefaultProfile(objectId: string): AgentProfile {
  const names = ['AlphaTrader', 'BetaBot', 'GammaAgent', 'DeltaAI', 'EpsilonBot'];
  const index = objectId.charCodeAt(objectId.length - 1) % names.length;

  return {
    objectId,
    name: names[index] + ' ' + objectId.slice(0, 4).toUpperCase(),
    description: 'Autonomous trading agent on Sui',
    imageUrl: '',
    website: '',
    socialTwitter: '',
    updatedAt: Date.now(),
  };
}
