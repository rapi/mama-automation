import promisify from 'cypress-promise'

describe("spec.cy.js", () => {
    it("should visit", async () => {
        cy.viewport(1920, 1080) // Set viewport to 550px x 750px

        const items = await promisify(cy.task('convert'))
        //
        console.log(items)
        cy.visit(Cypress.env('URL'))
        cy.get('#UserName').type(Cypress.env('EMAIL'))
        cy.get('#Password').type(Cypress.env('PASSWORD'))
        cy.get('button[type="submit"]').click()
        cy.get('.btn-adauga-factura-inline').click()
        cy.wait(1000)
        for (const i in items) {

            const [date, order, company, name, phone, priceLiv, price, ramb, product, comment, address, judet, cityM, streetBucurest, street] = items[i]
            console.log({
                date,
                order,
                company,
                name,
                phone,
                priceLiv,
                price,
                ramb,
                product,
                comment,
                address,
                judet,
                cityM,
                streetBucurest,
                street
            })


            //id
            console.log(`Set date for ${name}`)
            cy.get(".tr-date-factura-noua > .td-factura-title > .txt-numar-factura-registru").type(order)


            //date
            console.log(`Set date for ${name}`)
            cy.get(".tr-date-factura-noua > .td-data-emitere > .font-weight-normal").type(date).type('{enter}')

            //client
            console.log(`Set name for ${name}`)
            cy.get('.td-date-client > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input').type(name)
            const data = await promisify(cy.get('.td-date-client').find(".tt-suggestion"));
            if (data.text().includes(judet)) {
                for(const i in data){
                    if(String(data[i].innerText).includes(judet)){
                        data[i].click()
                    }
                }
                console.log(`Set existing client for ${name}`)

            } else {
                try{

                // add new client
                console.log(`Add new client for ${name}`)
                data.click()
                //phone
                console.log(`Setup phone for client ${name}`)
                cy.get("#Client_Telefon1").type(phone)
                cy.get(".judet>span").click()
                cy.get(".select2-search__field").type(judet)
                cy.get(".select2-results__option").click()
                cy.get(".select2-search__field").type(cityM.replaceAll(' ', '-'))
                cy.wait(1000)
                cy.get(".select2-results__option:first").click()

                //address
                console.log(`Setup address for client ${name}`)
                cy.wait(1000)
                cy.get('#Client_Adresa1').type("Strada: "+street)
                cy.get('.modal-editare-client',{timeout:100000}).should('not.exist');
                // cy.get('.btn-salveaza-client').click()
            }
            catch(e){}
            }


            //product
            console.log(`Setup product for client ${name}`)
            const products=product
            .split(" )")
            products.splice(-1)
            for(const j in products){
                cy.wait(1500)
                console.log(products[j])
                const code=products[j].split(":")[0].trim()
                console.log({code:products[j].split(" -  ")[0].split(' ( ')})

                const price=products[j].split(" -  ")[0].split(' ( ')[1].trim()
                console.log({code,price})

                const quantity=products[j].split(" -  ")[1].trim()
                console.log({code,price,quantity})
                cy.get(".td-date-produs:last > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input").type(code)


                const suggentions = await promisify(cy.get('.td-date-produs:last').find(".tt-suggestion:first"));
                console.log(suggentions)
                cy.get(".td-cantitate:last").type(quantity)
                cy.get(".td-total:last").type(String(parseFloat(quantity)*parseFloat(price)))
                cy.get(".td-tva:last").type("19")
                suggentions[0].click()
                cy.get(".btn-adauga-factura-continut").click()
            }


            //livrare
            console.log(`Setup delivery for client ${name}`)
            cy.get(".td-date-produs:last > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input").type("serviciul de livrare")
            const suggentions = await promisify(cy.get('.td-date-produs:last').find(".tt-suggestion"));
            suggentions.each((i, element) => {
                if (element.innerText.includes('19')) {
                    element.click()
                }
            })
            cy.get('[placeholder="Total"]:last').type("15.00").type("{enter}")

            console.log(`Wait for save ${name}`)
            cy.scrollTo('top') // Scroll 'sidebar' to its bottom
            //
            await promisify(cy.get('.td-date-produs:first > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input', {timeout: 1000000}).should('have.value', ""))
            // console.log('gogo')
        }

    })
})