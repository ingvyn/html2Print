

//Main();
// If you want the script to be un-doable, comment out the line above, and remove the comment from the line below
app.doScript(Main, undefined, undefined, UndoModes.ENTIRE_SCRIPT,"Run Script");

function Main() {
	// Check to see whether any InDesign documents are open.
	// If no documents are open, display an error message.
	if (app.documents.length > 0) {
        var measureUnitTemplate = {
            whatFind:{
                time: [
                    '(\\s)(сут[^а-я\\x{D}])',
                    '(\\s)(раз[^а-я\\x{D}])',
                    '(\\s)(раза[^а-я\\x{D}])',
                    '(\\s)(дней[^а-я\\x{D}])',
                    '(\\s)(дня[^а-я\\x{D}])',
                    '(\\s)(нед[^а-я\\x{D}])',
                    '(\\s)(года[^а-я\\x{D}])',
                    '(\\s)(лет[^а-я\\x{D}])',
                    '(\\s)(мес[^а-я\\x{D}])',
                    '(\\s)(ч[^а-я\\x{D}])',
                    '(\\s)(мин[^а-я\\x{D}])',
                    '(\\s)(c[^а-я\\x{D}])',
                    '(\\s)(мc)',                
                    '(\\s)(р/)',
                ],
                weight: [
                    '(\\s)(г[^а-я\\x{D}])',
                    '(\\s)(мг)',
                    '(\\s)(пг)',                
                    '(\\s)(нг)',
                    '(\\s)(мкг)',
                    '(\\s)(кг)',
                ],
                quantity: [
                    '(\\s)(пмоль])',
                    '(\\s)(нмоль)',
                    '(\\s)(мкмоль])',                
                    '(\\s)(ммоль])',
                    '(\\s)(табл[^а-я\\x{D}])',
                    '(\\s)(капель[^а-я\\x{D}])',                    
                    '(\\s)(капс[^а-я\\x{D}])',
                    '(\\s)(фл[^а-я\\x{D}])',
                    '(\\s)(пак[^а-я\\x{D}])',
                    '(\\s)(шт[^а-я\\x{D}])',                
                ],
                volume: [
                    '(\\s)(л[^а-я\\x{D}])',
                    '(\\s)(мл[^а-я\\x{D}])',
                ],
                distance: [
                    '(\\s)(мм)',
                    '(\\s)(см[[^а-я\\x{D}])',
                    '(\\s)(м[^а-я\\x{D}])',
                ],
                presssure: [
                    '(\\s)(мм\\sрт\\.ст\\.)',                
                ],
                power:[
                    '(\\s)(ккал)',
                    '(\\s)(кДж)'                
                ],
                pharmaMeasureUnit: [
                    '(\\s)(ЕД[^А-Я])',
                    '(\\s)(ЕД\\sЕФ)',
                    '(\\s)(ЕД\\s(FIP))',
                    '(\\s)(МЕ[^А-Я\\x{D}])'
                ],
                temperature: [
 //                   '(\\s)(<@176>C)' // для поиска в тегах Вентуры °C
                        '(\\s)(\\x{B0}C)'      // для поиска в InDesign °C               
                ],
                others: [
                    '(\\s)(\\x{2030})', // для поиска промилле ‰
                    '(\\s)(об\\.%)'
                ]
            },
//            changeTo: '<N>$2'
               changeTo: String.fromCharCode(160) + '$2' //для замены в InDesign       
        };


        var operationTemplateWithSpaceBefore = { // из поиска исключаются комбинации с запятой, предш. пробелу перед занакми сравнения (первая группа), т.е. строка, предш. запятой не склеивается со строкой, идущей после пробела после запятой. Можно добавить длинное тире
            whatFind:{
                comparison: [
                       // в последней группе угловых скобок вместо <F255> закрывающего тега шрифта в Вентуре ставится точка <.255> - InDesign упорно не хочет искать <F255>, принимая комбинацию за какой-то служебный символ                
                     '([^,])(\\s)(\\x{3E})', // >     
                      '([^,])(\\s)(\\x{3C})', // <
                      '([^,])(\\s)(\\x{2264})', // < или = 
                       '([^,])(\\s)(\\x{2265})' // > или равно 
                 ]
            }, 
            changeTo:  '$1' + String.fromCharCode(160) + '$3'
        };
    
        var operationTemplateWithSpaceAfter = {
            whatFind:{
                comparison: [
                        '(\\x{3E})(\\s)',
                        '(\\x{3C})(\\s)',
                        '(\\x{2264})(\\s)',
                        '(\\x{2265})(\\s)'
                 ]
            }, 
            changeTo:  '$1' + String.fromCharCode(160)
        };
    

// функция замены с параметром - шаблон замены
        var changeAllByTemplate = function (objTemplate) {
            app.findGrepPreferences = NothingEnum.NOTHING;
            app.changeGrepPreferences = NothingEnum.NOTHING;
            app.findChangeGrepOptions.includeMasterPages = false;            
            app.changeGrepPreferences.changeTo = objTemplate.changeTo;
            for (var key in objTemplate.whatFind) {
                    for (var j=0; j < objTemplate.whatFind[key].length; j++) {
                        app.findGrepPreferences.findWhat = objTemplate.whatFind[key][j];
                        app.changeGrep();
                    }
            }
        };
// 

        changeAllByTemplate(measureUnitTemplate);
        changeAllByTemplate(operationTemplateWithSpaceBefore);
        changeAllByTemplate(operationTemplateWithSpaceAfter); 
        

// Почему-то InD во время Grep замены самопроизвольно меняет комбинацию <F"Symbol">  на <F»Symbol»>, что ломает вентурный код. Поэтому проводим еще замену, только если работаем в вентуре
//Для работы над макетом в InDesign следующий блок можно закомментить
/*            
            app.findGrepPreferences = NothingEnum.NOTHING;
            app.changeGrepPreferences = NothingEnum.NOTHING;
            app.findGrepPreferences.findWhat =  'F»Symbol»';
            app.changeGrepPreferences.changeTo = 'F~"Symbol~"'; //  ~" внутреннее обозначение " в InD - см. диалог "НайтиЗаменить" вкладка Grep
            app.changeGrep();

*/
		alert("Finished!");
	}
	else {
		// No documents are open, so display an error message.
		alert("No InDesign documents are open. Please open a document and try again.");
	}
}