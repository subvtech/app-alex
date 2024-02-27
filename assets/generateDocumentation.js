import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
  mkdirSync,
} from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function slashToKebab(slashString) {
  return slashString
    .split('\\') // Split the string on backslashes
    .filter(Boolean) // Remove empty strings from the array
    .map((item) =>
      item.length > 0
        ? item[0] +
          item.slice(1).replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        : item,
    ) // handle camel case strings
    .join('-') // Join the array elements with hyphens
    .toLowerCase(); // Convert all the characters to lowercase
}

function listVueFiles(directoryPath) {
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const fullPath = path.join(directoryPath, file);

    if (statSync(fullPath).isDirectory()) {
      listVueFiles(fullPath);
    } else {
      const [filename, ext] = file.split('.');

      if (ext === 'vue') {
        const fileContent = readFileSync(fullPath, 'utf-8');

        const output = [];
        const emits = [];
        getInterfaceType(fileContent, output);
        // console.log({ [filename]: output });
        if (output.length === 0) return;
        getPropValues(fileContent, output);

        // console.log(filename);
        getEmitsType(fileContent, emits);

        const relativePath = slashToKebab(
          fullPath.split('components')[1].split('.')[0],
        );
        // https://dev.vuetifyjs.com/en/components/expansion-panels/#usage
        const vLinks = extractVTags(fileContent);
        writeDocumentation(
          { filename, relativePath, links: vLinks },
          getFileDescription(fileContent),
          emits,
          output,
        );
        // if (filename === 'AppUserAvatar') console.log({ [filename]: output });
      }
    }
  });
}

function getPropValues(fileContent, output) {
  const propsIndex = fileContent.indexOf('withDefaults');

  if (propsIndex === -1) return;

  const propsToEnd = fileContent.slice(propsIndex);
  const emptyLineIndex = propsToEnd.indexOf('});\r\n');
  const propsToEmptyLine = propsToEnd.slice(0, emptyLineIndex + 1);
  const linesProps = propsToEmptyLine.split('\n').slice(1, -1);

  for (let index = 0; index < linesProps.length; index++) {
    const line = linesProps[index];
    const parts = line.split(': ');
    if (parts.length < 2) continue;
    let value = parts[1].replace(/[,'"]/g, '').trim();
    if (value.toLowerCase() === 'undefined') continue;
    const name = parts[0].trim();

    const propIndex = output.findIndex((item) => item.name === name);

    if (value.includes('[]')) value = '[]';
    // console.log({ propIndex, name, parts, output });
    output[propIndex].initialValue = value;
    output[propIndex].default = value;
  }
  // console.log({ defaultValues: output });
}

function generateLink(componentName) {
  return `https://dev.vuetifyjs.com/en/components/${componentName}/#usage`;
}

function extractVTags(text) {
  // const regex = /v-\w+/g;
  // const regex = /v-\w+(-\w+)/g;
  const regex = /<v-\w+(?:-\w+)*/g;
  let match;
  const result = [];
  const forbidden = [
    'v-for',
    'v-else',
    'v-if',
    'v-else-if',
    'v-model',
    'v-row',
    'v-theme',
    'v-theme-gray-blue',
    'v-spacer',
    'v-divider',
    'v-maska',
    'v-icon',
    'v-col',
    'v-bind',
    'v-border',
    'v-expansion-panel-title__overlay',
    'v-expansion-panel-title',
    'v-expansion-panel-text',
    'v-toolbar-title',
    'v-list-item',
    'v-window-item',
  ];

  while ((match = regex.exec(text)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `match`-object.
    match.forEach((item) => {
      const itemName = item.slice(1);
      if (!result.includes(itemName) && !forbidden.includes(itemName)) {
        result.push(itemName);
      }
    });
  }
  return result.map((item) => generateLink(item));
}

function getInterfaceType(fileContent, output) {
  const interfaceIndex = fileContent.indexOf('ComponentType {');

  if (interfaceIndex === -1) return;
  const interfaceToEnd = fileContent.slice(interfaceIndex);
  const emptyLineIndex = interfaceToEnd.indexOf('}\r\n');
  if (emptyLineIndex === -1) return;

  const interfaceToEmptyLine = interfaceToEnd.slice(0, emptyLineIndex + 1);
  const linesInterface = interfaceToEmptyLine.split('\n').slice(1, -1);

  const multipleLiner = {};
  for (let index = 0; index < linesInterface.length; index++) {
    let line = linesInterface[index];
    if (!line) continue;
    const isOptional = !/\?/i.test(line);
    const theresDescription = line.includes('//');
    const endProp = line.includes(';');
    line = line.replace(/[;?]/g, '');

    // split the line by colon and question mark
    const parts = line.split(': ');
    if (parts.length < 2) {
      const name = Object.keys(multipleLiner)[0];
      if (line.includes(':')) multipleLiner[line.trim().split(':')[0]] = '';
      else multipleLiner[name] += ' ' + line.split('\\')[0].trim();

      if (endProp) {
        const description = theresDescription
          ? parts[0].trim().split('//')
          : "There's no description.";

        const prop = {
          name,
          required: isOptional,
          description: description.trim(),
          type: multipleLiner[name].substring(2).trim(),
        };

        output.push(prop);
      }

      continue;
    }

    // get the property name, type, and optional flag
    const name = parts[0].trim();

    const [type, description] = theresDescription
      ? parts[1].trim().split('//')
      : [parts[1].trim(), "There's no description."];

    // create a PropItemType object with the extracted values
    const prop = {
      name,
      required: isOptional,
      description: description.trim(),
      type,
    };

    output.push(prop);
  }
  // console.log({ interface: output });
}

function getEmitsType(fileContent, output) {
  const interfaceIndex = fileContent.indexOf('Emits {');

  if (interfaceIndex === -1) return;
  const interfaceToEnd = fileContent.slice(interfaceIndex);
  const emptyLineIndex = interfaceToEnd.indexOf('}\r\n');
  if (emptyLineIndex === -1) return;

  const interfaceToEmptyLine = interfaceToEnd.slice(0, emptyLineIndex + 1);
  const linesInterface = interfaceToEmptyLine.split('\n').slice(1, -1);

  for (let index = 0; index < linesInterface.length; index++) {
    let line = linesInterface[index];
    if (!line) continue;

    const theresDescription = line.includes('//');
    line = line.replace(/[;]/g, '');

    const trimmedLine = line.trim();
    const splitLine = trimmedLine.split('//');
    const parameters = splitLine[0];
    const description = theresDescription
      ? splitLine[1].trim()
      : "There's no description";

    // get the property name, type, and optional flag

    const splittedParams = parameters.split("'");
    const name = splittedParams[1].trim();
    const type = (
      '(' +
      splittedParams[2].split('): void')[0].slice(1).trim() +
      ') => ' +
      splittedParams[2].split('): ')[1]
    ).trim();
    // create a PropItemType object with the extracted values

    const prop = {
      name,
      description,
      type,
    };
    output.push(prop);
  }
  // console.log({ interface: output });
}

function getFileDescription(fileContent) {
  const matchLine = `<script setup lang="ts">\r\n`;
  const script = fileContent.indexOf(matchLine);
  if (script === -1) return;

  const scriptToEnd = fileContent.slice(script);

  if (
    fileContent[script + matchLine.length] +
      fileContent[script + matchLine.length + 1] !==
    '/*'
  )
    return;

  const emptyLineIndex = scriptToEnd.indexOf('*/\r\n');
  if (emptyLineIndex === -1) return;

  const scriptToEmptyLine = scriptToEnd.slice(
    matchLine + 1,
    emptyLineIndex + 1,
  );
  const linesDescription = scriptToEmptyLine.split('\r\n').slice(1, -1);

  return linesDescription
    .slice(1)
    .map((line) => line.trim())
    .join('\n');
}

function writeDocumentation(
  { filename, relativePath, links },
  description,
  emits,
  props,
) {
  const propsCount = props.length > 3;
  const emitsCount = emits.length > 3;
  let myProps = '[';
  let playgroundProps = '';
  props.forEach((item) => {
    myProps += '{';
    myProps += `name : \`${item.name}\`,`;
    myProps += `required : ${item.required},`;
    myProps += `description : \`${item.description}\`,`;
    myProps += `type : \`${item.type}\`,`;
    if (item.initialValue)
      myProps += `initialValue : ${
        item.initialValue === '[]' ? '[]' : `'${item.initialValue}'`
      },`;
    if (item.default) myProps += `default : \`${item.default}\`},`;
    else myProps += '},';
    playgroundProps += `:${item.name}="props.${item.name}" `;
  });
  myProps += ']';

  let myEmits = '[';

  emits.forEach((item) => {
    myEmits += '{';
    myEmits += `name : \`${item.name}\`,`;
    myEmits += `description : \`${item.description}\`,`;
    myEmits += `type : \`${item.type}\`},`;
  });
  myEmits += ']';

  // console.log(myProps);

  const text = `<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="${filename}" description="${description}" ${
      links.length > 0 ? `vuetify-link="${links[0]}"` : ''
    } />
    <alex-documentation-accordions-props-list
      :data="myProps"
      :show-positions="propsCount"
    />
    <alex-documentation-accordions-props-list
      v-if="myEmits.length > 0"
      :data="myEmits"
      :show-positions="emitsCount"
      list-emits
    />
   
    <alex-documentation-playground :data="myProps">
      <template #component="{ props }">
        <${relativePath} ${playgroundProps}
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>
<script setup lang="ts">

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const myProps = ${myProps};
const myEmits = ${myEmits};
const emitsCount = ${emitsCount};
const propsCount = ${propsCount};

</script>
`;

  const path = `pages/components/generated/`;

  // Check if the directory exists
  if (!existsSync(path)) {
    // If the directory doesn't exist, create it
    mkdirSync(path, { recursive: true });
  }

  writeFileSync(`${path}${filename}.vue`, text);
}

listVueFiles(path.join(__dirname, '../components'));
