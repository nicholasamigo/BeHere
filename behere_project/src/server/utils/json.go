package utils

import (
	"encoding/json"
)

func StructToJSON(data interface{}) ([]byte, error) {
	b, err := json.Marshal(data)

	if err != nil {
		return nil, err
	}

	return b, nil
}

/* json data, raw json data to be converted
*  ptr* interface{}, pointer to a struct
 */
func JSONToStruct(jsondata []byte, structptr *interface{}) error {
	err := json.Unmarshal(jsondata, structptr)
	if err != nil {
		return err
	}
	return nil
}
