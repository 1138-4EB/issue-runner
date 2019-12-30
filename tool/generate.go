package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path"

	"github.com/mholt/archiver"
	v "github.com/spf13/viper"
)

func (e *mwe) loc() string {
	tmp := v.GetString("tmp")
	if len(tmp) > 0 {
		return path.Join(tmp, e.dir)
	}
	return e.dir
}

func (e *mwe) generate() error {
	loc := e.loc()

	info, err := os.Stat(loc)

	if err == nil {
		if !info.IsDir() {
			return fmt.Errorf("%s exists and it is not a directory, cannot proceed", loc)
		}
		fmt.Println(fmt.Sprintf("RemoveAll '%s'", loc))
		os.RemoveAll(loc)
	} else if os.IsNotExist(err) {
		// Continue, and create it below
	} else if err != nil {
		return err
	}

	fmt.Println(fmt.Sprintf("MkdirAll '%s'", loc))
	err = os.MkdirAll(loc, 0755)
	if err != nil {
		return err
	}

	for _, s := range e.snippets {
		p := path.Join(loc, s.name)
		if _, err := os.Stat(p); err == nil {
			fmt.Println("WARNING! file", p, "exists, overwriting")
		}
		err := ioutil.WriteFile(p, s.bytes, 0755)
		if err != nil {
			return err
		}
	}

	for _, l := range e.links {
		resp, err := http.Get((*l)[1])
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		fname := (*l)[0]
		_, err = archiver.ByExtension(fname)
		if err != nil {
			if err = bodyToDisk(resp.Body, path.Join(loc, fname)); err != nil {
				return err
			}
			continue
		}
		if err = unarchive(resp.Body, loc, fname); err != nil {
			return err
		}
	}
	return nil
}

func (es *mwes) generate() error {
	for x, e := range *es {
		fmt.Println("Generating...", x, e)
		if err := e.generate(); err != nil {
			return err
		}
	}
	return nil
}

func bodyToDisk(src io.Reader, path string) error {
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()
	_, err = io.Copy(out, src)
	return err
}

func unarchive(src io.Reader, loc, name string) error {
	fpath := path.Join(loc, name)
	if err := bodyToDisk(src, fpath); err != nil {
		return err
	}
	return archiver.Unarchive(fpath, loc)
}
