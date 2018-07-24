import React from 'react'
import elasticlunr from 'elasticlunr'
let googleSheetFileName = 'Conrad Swipe File'

class GoogleSpeadsheet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            spreadsheetId: false,
            initGoogleSpreadsheetDocPending: true,
            quotes: []
        }

        this.createNewSheet = this.createNewSheet.bind(this)
        this.getSheet = this.getSheet.bind(this)
        this.getOrCreateSheet = this.getOrCreateSheet.bind(this)
        this.writeHeader = this.writeHeader.bind(this)
        this.read = this.read.bind(this)
        this.add = this.add.bind(this)
        this.edit = this.edit.bind(this)
        this._edit = this._edit.bind(this)
        this._add = this._add.bind(this)
        this.refreshIndex = this.refreshIndex.bind(this)
        this.initIndex = this.initIndex.bind(this)
        this.search = this.search.bind(this)
        this.initIndex()
        this.getOrCreateSheet()
            .then(spreadsheetId => {
                this.setState({
                    spreadsheetId
                })
                return this.read(spreadsheetId, 10000, 1)
            }).then(quotes => {
                this.setState({
                    quotes,
                    initGoogleSpreadsheetDocPending: false
                })
                this.refreshIndex(quotes)
            })

        window.s = this.search
        
        
    }

    search(text){
        let result = this.searchIndex.search(text, {expand: true})
        let ids = []
        result.forEach(r => {
            ids.push(r.ref)
        })
        return this.state.quotes.filter(quote => {
            return  ids.findIndex(id => parseInt(id, 10) === quote.id ) >=0
        })
    }

    initIndex(){
        this.searchIndex = elasticlunr(function () {
            this.addField('quote');
            this.addField('author');
            this.addField('tags');
            this.addField('categories');
            this.addField('note');
            this.setRef('id');
        });
    }

    refreshIndex(quotes){
        quotes.forEach(q => {
            this.searchIndex.addDoc(q)
        })
    }
    async edit(quote){
        this.setState({
            initGoogleSpreadsheetDocPending: true
        })
        
        let quotes = await this.read(this.state.spreadsheetId, 10000, 1)
        await this._edit(this.state.spreadsheetId, quote)
        quotes = await this.read(this.state.spreadsheetId, 10000, 1)
        this.setState({
            quotes,
            initGoogleSpreadsheetDocPending: false
        })
        this.initIndex()
        this.refreshIndex(quotes)
    }

    async add(quote){
        this.setState({
            initGoogleSpreadsheetDocPending: true
        })
        await this._add(this.state.spreadsheetId,quote)
        let quotes = await this.read(this.state.spreadsheetId, 10000, 1)
        this.setState({
            quotes,
            initGoogleSpreadsheetDocPending: false
        })
        this.initIndex()
        this.refreshIndex(quotes)
    }

    _edit(spreadsheetId, quote) {
        
        let values = [[
            quote.quote,
            quote.author,
            quote.note,
            quote.categories && Array.isArray(quote.categories)? quote.categories.join(', '):quote.categories, 
            quote.tags && Array.isArray(quote.tags)? quote.tags.join(', '):quote.tags ,
        ]]

        let rowNumber = quote.id + 2 // first is header and id counted from 0, in spreadsheet from 1 
 
        return window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `A${rowNumber}:E${rowNumber}`,
            valueInputOption: 'RAW',
            resource: { values: values }
        })
    }


    _add(spreadsheetId, quote) {
        let values = [[
            quote.quote,
            quote.author,
            quote.note,
            quote.categories,
            quote.tags,
        ]]

        return window.gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'A1:E100000',
            valueInputOption: 'RAW',
            resource: { values: values }
        })
    }

    async read(sheetId, limit = 10000, offset = 0) {
        return window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `A${offset + 1}:E${limit + offset + 1}`,
        }).then(r => {

            return r.result.values.map((row, index) => {
                return {
                    id: index,
                    quote: row[0],
                    author: row[1],
                    note: row[2],
                    categories: row[3] ? row[3].split(',') : [],
                    tags: row[4] ? row[4].split(',') : [],
                }
            })
        })
    }

    async writeHeader(sheetId) {
        let values = [
            ['Quote', 'Author', 'Note', 'Categories', 'Tags'],
            ['My task, which I am trying to achieve is, by the power of the written word, to make you hear, to make you feel--it is, before all, to make you see.', 'Joseph Conrad', '', 'quotes', 'writing,trying,tasks'],
            ['I don\'t like work... but I like what is in work - the chance to find yourself. Your own reality - for yourself, not for others - which no other man can ever know.', 'Joseph Conrad', '', 'quotes', 'inspirational,being yourself,work'],
            ['Words, as is well known, are the great foes of reality.', 'Joseph Conrad', '', 'quotes', 'writing,reality,speech'],

        ]
        return window.gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: 'A1:E4',
            valueInputOption: 'RAW',
            resource: { values: values }
        })
    }

    async getOrCreateSheet() {
        let sheet = await this.getSheet()
        if (sheet) {
            return sheet.id
        }

        sheet = await this.createNewSheet()
        await this.writeHeader(sheet.spreadsheetId)
        return sheet.spreadsheetId
    }

    createNewSheet() {
        let spreadsheetBody = {
            properties: { title: googleSheetFileName }
        };

        var request = window.gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
        return request.then(function (response) {
            return response.result
        }, function (reason) {
            throw new Error(reason)
        });
    }

    getSheet() {
        return window.gapi.client.drive.files.list({
            'pageSize': 10,
            q: `name = '${googleSheetFileName}' and trashed = false`,
            'fields': "nextPageToken, files(id, name, parents, properties)"
        }).then(function (response) {
            var files = response.result.files;
            if (files.length === 0) {
                return false
            }
            if (files.length > 1) {
                throw new Error(`More then one '${googleSheetFileName}' file on drive`)
            }
            return files[0]
        });
    }

    render() {
        return this.props.render({ ...this.state, add: this.add, edit: this.edit,  search: this.search })
    }

}


export default GoogleSpeadsheet