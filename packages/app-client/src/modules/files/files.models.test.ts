import { icons as tablerIconSet } from '@iconify-json/tabler';
import { values } from 'lodash-es';
import { describe, expect, test } from 'vitest';
import { getFileIcon, iconByFileType } from './files.models';

describe('files models', () => {
  describe('iconByFileType', () => {
    const icons = values(iconByFileType);

    test('they must at least have the default icon', () => {
      expect(iconByFileType['*']).toBeDefined();
    });

    test('all the icons should be from tabler icon set', () => {
      for (const icon of icons) {
        expect(icon).to.match(/^i-tabler-/, `Icon ${icon} is not from tabler icon set`);
      }
    });

    test('icons should not contain any spaces', () => {
      for (const icon of icons) {
        expect(icon).not.to.match(/\s/, `Icon ${icon} contains spaces`);
      }
    });

    test('the icons used for showing file types should exists with current iconify configuration', () => {
      for (const icon of icons) {
        const iconName = icon.replace('i-tabler-', '');
        const iconData = tablerIconSet.icons[iconName] ?? tablerIconSet.aliases?.[iconName];

        expect(iconData).to.not.eql(undefined, `Icon ${icon} does not exist in tabler icon set`);
      }
    });
  });

  describe('getFileIcon', () => {
    test('a file icon is selected based on the file type', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const iconsMap = {
        '*': 'i-tabler-file',
        'text/plain': 'i-tabler-file-text',
      };
      const icon = getFileIcon({ file, iconsMap });

      expect(icon).to.eql('i-tabler-file-text');
    });

    test('if a file type is not associated with an icon, the default icon is used', () => {
      const file = new File([''], 'test.txt', { type: 'text/html' });
      const iconsMap = {
        '*': 'i-tabler-file',
        'text/plain': 'i-tabler-file-text',
      };
      const icon = getFileIcon({ file, iconsMap });

      expect(icon).to.eql('i-tabler-file');
    });

    test('a file icon can be selected based on the file type group', () => {
      const file = new File([''], 'test.html', { type: 'text/html' });
      const iconsMap = {
        '*': 'i-tabler-file',
        'text': 'i-tabler-file-text',
      };
      const icon = getFileIcon({ file, iconsMap });

      expect(icon).to.eql('i-tabler-file-text');
    });

    test('when an icon is defined for both the whole type and the group type, the file type icon is used', () => {
      const file = new File([''], 'test.html', { type: 'text/html' });
      const iconsMap = {
        '*': 'i-tabler-file',
        'text': 'i-tabler-file-text',
        'text/html': 'i-tabler-file-type-html',
      };
      const icon = getFileIcon({ file, iconsMap });

      expect(icon).to.eql('i-tabler-file-type-html');
    });
  });
});
