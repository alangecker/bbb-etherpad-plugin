// adds 'revs' and 'changeset' to padUpdate events for closed captions

const Pad = require('ep_etherpad-lite/node/db/Pad').Pad
const db = require("ep_etherpad-lite/node/db/DB");
const Changeset = require("ep_etherpad-lite/static/js/Changeset");
const authorManager = require("ep_etherpad-lite/node/db/AuthorManager");
const hooks = require('ep_etherpad-lite/static/js/pluginfw/hooks');

Pad.prototype.appendRevision = async function appendRevision(aChangeset, author) {
    if (!author) {
      author = '';
    }
  
    var newAText = Changeset.applyToAText(aChangeset, this.atext, this.pool);
    Changeset.copyAText(newAText, this.atext);
  
    var newRev = ++this.head;
  
    var newRevData = {};
    newRevData.changeset = aChangeset;
    newRevData.meta = {};
    newRevData.meta.author = author;
    newRevData.meta.timestamp = Date.now();
  
    // ex. getNumForAuthor
    if (author != '') {
      this.pool.putAttrib(['author', author || '']);
    }
  
    if (newRev % 100 == 0) {
      newRevData.meta.pool = this.pool;
      newRevData.meta.atext = this.atext;
    }
  
    const p = [
      db.set('pad:' + this.id + ':revs:' + newRev, newRevData),
      this.saveToDatabase(),
    ];
  
    // set the author to pad
    if (author) {
      p.push(authorManager.addPad(author, this.id));
    }
  
    if (this.head == 0) {
      hooks.callAll("padCreate", {'pad':this, 'author': author});
    } else {

      // only this line is changed
      console.log({newRev, aChangeset})
      hooks.callAll("padUpdate", {'pad':this, 'author': author, 'revs': newRev, 'changeset': aChangeset});
      // --------------------------
    }
  
    await Promise.all(p);
  };