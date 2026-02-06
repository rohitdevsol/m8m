type HttpHandlerInput = {
  node: any;
  inputs: Record<string, any>;
  credentials: any[];
};

export async function httpHandler({
  node,
  inputs,
  credentials,
}: HttpHandlerInput) {
  const url = node.data.url;

  const res = await fetch(url);
  const data = await res.json();

  return data;
}
