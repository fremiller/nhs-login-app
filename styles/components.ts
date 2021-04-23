import {StyleSheet} from 'react-native';
import * as Colors from './colors';

export const components = StyleSheet.create({
  textField: {
    borderColor: Colors.FormBorderColor,
    borderWidth: 3,
    backgroundColor: Colors.White,
    fontSize: 21,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  picker: {
    borderColor: Colors.FormBorderColor,
    borderWidth: 3,
    borderStyle: 'solid',
    backgroundColor: Colors.White,
    fontSize: 21,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 21,
    width: '100%',
    flexShrink: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
