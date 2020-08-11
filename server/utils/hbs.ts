import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'hbs';

export const loadPartials = (pathName: string): void => {
  const partialsDir = path.join(__dirname, '..', pathName);
  const filenames = fs.readdirSync(partialsDir);

  filenames.forEach((filename) => {
    const matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    const name = `_${matches.pop()}`;
    const template = fs.readFileSync(path.join(partialsDir, filename), 'utf8');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    hbs.registerPartial(name, template);
  });
};
