using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ProjetoEscola_API.Models
{
    public class Aluno
    {
        [Display(Name = "Código", Description = "Informe um inteiro entre 1 e 99999.")]
        public int id { get; set; }

        [Display(Name = "RA", Description = "O RA deve estar no formato XXXXX.")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.", AllowEmptyStrings = false)]
        [StringLength(5, MinimumLength = 5, ErrorMessage = "O campo {0} não respeita o formato de RA: XXXXX")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Digite um RA inteiro positivo maior que 0.")]
        public string? ra { get; set; }

        [Display(Name = "Nome Completo", Description = "Nome e Sobrenome.")]
        [Required(ErrorMessage = "O campo Nome é obrigatório.", AllowEmptyStrings = false)]
        [StringLength(30, ErrorMessage = "O campo Nome não pode ultrapassar {1} caracteres")]
        [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$", ErrorMessage="Números e caracteres especiais não são permitidos no nome.")]
        public string? nome { get; set; }

        [Display(Name = "Código do Curso", Description = "O Código do Curso que o aluno está cursando.")]
        [Required(ErrorMessage = "O campo CodCurso é obrigatório.")]
        [Range(1, 99, ErrorMessage = "Digite o {0} sendo um número entre {1}-{2}.")]
        public int codCurso { get; set; }
    }
}

