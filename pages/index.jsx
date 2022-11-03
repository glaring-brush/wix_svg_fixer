import Head from 'next/head';
import { useEffect, useState } from 'react';

const initialSVG = `
<svg
  xmlns='http://www.w3.org/2000/svg'
  class='icon icon-tabler icon-tabler-access-point'
  width='44'
  height='44'
  viewBox='0 0 24 24'
  stroke-width='1.5'
  stroke='currentColor'
  fill='none'
  stroke-linecap='round'
  stroke-linejoin='round'
>
  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
  <line x1='12' y1='12' x2='12' y2='12.01' />
  <path d='M14.828 9.172a4 4 0 0 1 0 5.656' />
  <path d='M17.657 6.343a8 8 0 0 1 0 11.314' />
  <path d='M9.168 14.828a4 4 0 0 1 0 -5.656' />
  <path d='M6.337 17.657a8 8 0 0 1 0 -11.314' />
</svg>
`;

function saveSVG(name) {
  let svgData = document.querySelector('#icon-download').outerHTML;
  let svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  let svgUrl = URL.createObjectURL(svgBlob);
  let downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = `${name || 'icon'}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function TextArea({ value, onChange }) {
  return (
    <textarea className="w-full font-mono text-xs bg-white grow" value={value} onChange={onChange} spellCheck={false} />
  );
}

export default function Home() {
  const [inputSVG, setInputSVG] = useState(initialSVG);
  const [outputSVG, setOutputSVG] = useState('');

  const [name, setName] = useState('icon');

  useEffect(() => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(inputSVG, 'image/svg+xml');
    svgDoc.documentElement.setAttribute('stroke', 'blue');
    svgDoc.documentElement.removeAttribute('class');
    svgDoc.documentElement.setAttribute('id', 'icon-download');

    let values = {};
    for (let attr of ['stroke', 'stroke-linejoin', 'stroke-linecap', 'fill', 'stroke-width']) {
      values[attr] = svgDoc.documentElement.getAttribute(attr);
      svgDoc.documentElement.removeAttribute(attr);
    }

    for (let element of ['path', 'line', 'rect', 'circle']) {
      svgDoc.querySelectorAll(element).forEach((entry) => {
        for (let attr of ['stroke', 'stroke-linejoin', 'stroke-linecap', 'fill', 'stroke-width']) {
          entry.setAttribute(attr, values[attr]);
        }
      });
    }

    setOutputSVG(svgDoc.documentElement.outerHTML);
  }, [inputSVG]);

  return (
    <div className="flex flex-col max-w-6xl min-h-screen p-4 mx-auto bg-slate-100 Container">
      <Head>
        <title>WIX SVG Fixer app</title>
        <meta name="description" content="WIX SVG Fixer app app" />
      </Head>

      <main className="flex flex-col grow Main">
        <h1 className="text-3xl font-bold Title">SVG Converter</h1>

        <p>Welcome to SVG Converter</p>

        <div className="flex mt-4 grow">
          <div className="flex flex-col pr-2 grow basis-1/2">
            <h2>Paste SVG:</h2>
            <TextArea value={inputSVG} onChange={(event) => setInputSVG(event.target.value)} />
            <div className="relative flex flex-col basis-1/2">
              <h2>Result:</h2>
              <div
                className="flex items-center justify-center grow bg-slate-200"
                dangerouslySetInnerHTML={{ __html: outputSVG }}
              ></div>
              <button className="absolute bottom-0 right-0" onClick={() => saveSVG(name)}>
                Download
              </button>
            </div>
          </div>
          <div className="flex flex-col pl-2 grow basis-1/2">
            <div className="flex flex-col grow">
              <h2>Result SVG:</h2>
              <input className="mb-2" value={name} onChange={(event) => setName(event.target.value)} />
              <TextArea value={outputSVG} onChange={(event) => setOutputSVG(event.target.value)} />
            </div>
          </div>
        </div>
      </main>

      <footer className="Footer"></footer>
    </div>
  );
}
