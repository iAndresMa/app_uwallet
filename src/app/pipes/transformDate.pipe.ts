import { Pipe, PipeTransform } from '@angular/core'


@Pipe({
    name: "transformDate"
})

export class TransformDatePipe implements PipeTransform {
    transform(date: string): string {
        const dateObject = new Date(date + 'T00:00:00');
    
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
    
        const monthNames = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
    
        // se obtiene el nombre del mes
        const descripcionMonth = monthNames[month - 1];
    
        // se formatea la fecha deseada
        return `${descripcionMonth} ${day}, ${year}`;
    }
}